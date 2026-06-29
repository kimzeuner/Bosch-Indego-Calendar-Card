import {
  DAYS,
  DEFAULT_CONFIG,
  color,
  findCalendarEntity,
  getNextSlotFromCalendar,
  getSlotsForDay,
  getWeatherExclusionsForDay,
  isToday,
  slotToPosition,
} from "./helpers.js";
import { styles } from "./styles.js";
import { translate } from "./translations.js";

class IndegoCalendarCard extends HTMLElement {
  t(key) {
    return translate((this._hass?.language || "en").split("-")[0], key);
  }

  setConfig(config) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      entity: config.entity ?? DEFAULT_CONFIG.entity,
      title: config.title ?? DEFAULT_CONFIG.title,
    };
  }

  set hass(hass) {
    this._hass = hass;

    const { entity } = findCalendarEntity(hass, this.config.entity);

    if (!entity) {
      this.innerHTML = `
        <ha-card>
          <div style="padding:16px;">
            ${this.t("entity_not_found")}: ${this.config.entity}
          </div>
        </ha-card>
      `;
      return;
    }

    const dayColor = color(this.config.day_color, DEFAULT_CONFIG.day_color);
    const slotColor = color(this.config.slot_color, DEFAULT_CONFIG.slot_color);
    const nowColor = color(this.config.now_color, DEFAULT_CONFIG.now_color);
    const todayBorderColor = color(
      this.config.today_border_color,
      DEFAULT_CONFIG.today_border_color,
    );
    const dayTextColor = color(
      this.config.day_text_color,
      DEFAULT_CONFIG.day_text_color,
    );
    const weatherExclusionColor = color(
      this.config.weather_exclusion_color,
      DEFAULT_CONFIG.weather_exclusion_color,
    );

    const attr = entity.attributes;
    const title = this.config.title || this.t("title");
    const subtitle = this.renderSubtitle(attr);

    this.innerHTML = `
      <ha-card>
        <div class="card">
          <div class="title">${title}</div>
          ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ""}

          <div class="scale">
            <div></div>
            <div class="scale-inner">
              <span style="left:0%;transform:translateX(0);">00</span>
              <span style="left:25%;">06</span>
              <span style="left:50%;">12</span>
              <span style="left:75%;">18</span>
              <span style="right:0%;transform:translateX(0);">24</span>
            </div>
          </div>

          ${DAYS.map((day) =>
            this.renderDayRow({
              day,
              attr,
              dayColor,
              dayTextColor,
              slotColor,
              nowColor,
              todayBorderColor,
              weatherExclusionColor,
            }),
          ).join("")}

          ${this.config.show_legend
            ? this.renderLegend(slotColor, weatherExclusionColor, nowColor)
            : ""}
        </div>
      </ha-card>

      ${styles}
    `;
  }

  renderSubtitle(attr) {
    if (!this.config.show_next_mow) return "";

    const nextMowSlot = attr.next_mow_slot;
    const nextMowDay = attr.next_mow_day;
    const nextMowTime = attr.next_mow_time;

    if (nextMowSlot) {
      return `${this.t("subtitle_next_mow")}: ${nextMowSlot}`;
    }

    if (nextMowDay && nextMowTime) {
      return `${this.t("subtitle_next_mow")}: ${this.t(nextMowDay)} ${nextMowTime}`;
    }

    const calculatedNextSlot = getNextSlotFromCalendar(attr);

    if (calculatedNextSlot) {
      return `${this.t("subtitle_next_mow")}: ${this.t(calculatedNextSlot.day)} ${calculatedNextSlot.slot}`;
    }

    return "";
  }

  renderDayRow({
    day,
    attr,
    dayColor,
    dayTextColor,
    slotColor,
    nowColor,
    todayBorderColor,
    weatherExclusionColor,
  }) {
    const today = isToday(day);
    const highlighted = this.config.highlight_today && today;

    return `
      <div class="row">
        <div
          class="day"
          style="background:${dayColor}; color:${dayTextColor};"
        >
          ${this.t(day)}
        </div>

        <div
          class="track"
          style="
            border-color:${highlighted ? todayBorderColor : "var(--divider-color)"};
            border-width:${highlighted ? "2px" : "1px"};
          "
        >
          <div class="line" style="left:25%;"></div>
          <div class="line" style="left:50%;"></div>
          <div class="line" style="left:75%;"></div>

          ${getSlotsForDay(attr, day)
            .map((slot) => this.renderSlot(slot, slotColor))
            .join("")}

          ${this.config.show_weather_exclusions
            ? getWeatherExclusionsForDay(attr, day)
                .map((slot) =>
                  this.renderWeatherExclusion(slot, weatherExclusionColor),
                )
                .join("")
            : ""}

          ${this.renderTodayLine(day, nowColor)}
        </div>
      </div>
    `;
  }

  renderSlot(slot, slotColor) {
    const position = slotToPosition(slot);
    if (!position) return "";

    return `
      <div
        class="slot"
        title="${this.t("tooltip_mowing")}: ${slot}"
        style="
          left:${position.left}%;
          width:${position.width}%;
          background:${slotColor};
        "
      ></div>
    `;
  }

  renderWeatherExclusion(slot, weatherExclusionColor) {
    const position = slotToPosition(slot);
    if (!position) return "";

    return `
      <div
        class="weather-exclusion"
        title="${this.t("tooltip_weather")}: ${slot}"
        style="
          left:${position.left}%;
          width:${position.width}%;
          background-color:${weatherExclusionColor};
        "
      ></div>
    `;
  }

  renderTodayLine(day, nowColor) {
    const weekday = DAYS[(new Date().getDay() + 6) % 7];

    if (day !== weekday) return "";

    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const left = (minutes / 1440) * 100;

    return `
      <div
        class="now-line"
        style="left:${left}%; background:${nowColor};"
      ></div>
    `;
  }

  renderLegend(slotColor, weatherExclusionColor, nowColor) {
    return `
      <div class="legend">
        <div class="legend-item">
          <span class="legend-box legend-slot" style="background:${slotColor};"></span>
          <span>${this.t("legend_mowing")}</span>
        </div>

        <div class="legend-item">
          <span
            class="legend-box legend-weather"
            style="--weather-exclusion-color:${weatherExclusionColor};"
          ></span>
          <span>${this.t("legend_weather")}</span>
        </div>

        <div class="legend-item">
          <span class="legend-now" style="background:${nowColor};"></span>
          <span>${this.t("legend_now")}</span>
        </div>
      </div>
    `;
  }

  getCardSize() {
    return 4;
  }

  static getStubConfig() {
    return { ...DEFAULT_CONFIG };
  }

  static getConfigElement() {
    return document.createElement("indego-calendar-card-editor");
  }
}

customElements.define("indego-calendar-card", IndegoCalendarCard);
