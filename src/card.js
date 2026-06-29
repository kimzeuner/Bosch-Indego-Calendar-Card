import { LitElement, html, css, unsafeCSS } from "lit";
import {
  DAYS,
  DEFAULT_CONFIG,
  autoDetectCalendarEntity,
  cssColor,
  getSlotsForDay,
  getWeatherExclusionsForDay,
  nextSlotFromCalendar,
  slotPosition,
  todayKey,
} from "./helpers.js";
import { CARD_STYLES } from "./styles.js";
import { getTranslations, t } from "./translations.js";

export class IndegoCalendarCard extends LitElement {
  static properties = {
    hass: {},
    config: { state: true },
  };

  static styles = css`
    ${unsafeCSS(CARD_STYLES)}
  `;

  static getConfigElement() {
    return document.createElement("indego-calendar-card-editor");
  }

  static getStubConfig() {
    return { ...DEFAULT_CONFIG };
  }

  setConfig(config) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      entity: config.entity ?? DEFAULT_CONFIG.entity,
      title: config.title ?? DEFAULT_CONFIG.title,
    };
  }

  getCardSize() {
    return 4;
  }

  getColors() {
    return {
      day: cssColor(this.config.day_color, DEFAULT_CONFIG.day_color),
      slot: cssColor(this.config.slot_color, DEFAULT_CONFIG.slot_color),
      now: cssColor(this.config.now_color, DEFAULT_CONFIG.now_color),
      todayBorder: cssColor(
        this.config.today_border_color,
        DEFAULT_CONFIG.today_border_color
      ),
      dayText: cssColor(this.config.day_text_color, DEFAULT_CONFIG.day_text_color),
      weatherExclusion: cssColor(
        this.config.weather_exclusion_color,
        DEFAULT_CONFIG.weather_exclusion_color
      ),
    };
  }

  render() {
    if (!this.hass || !this.config) return html``;

    const translations = getTranslations(this.hass);
    const entityId = autoDetectCalendarEntity(this.hass, this.config.entity);
    const entity = entityId ? this.hass.states[entityId] : undefined;

    if (!entity) {
      return html`
        <ha-card>
          <div class="card">
            ${t(translations, "entity_not_found")}: ${this.config.entity || ""}
          </div>
        </ha-card>
      `;
    }

    const colors = this.getColors();
    const attributes = entity.attributes;
    const title = this.config.title || t(translations, "title");
    const subtitle = this.renderSubtitle(translations, attributes);

    return html`
      <ha-card>
        <div class="card">
          <div class="title">${title}</div>
          ${subtitle ? html`<div class="subtitle">${subtitle}</div>` : html``}

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

          ${DAYS.map((day) => this.renderDayRow(translations, attributes, day, colors))}
          ${this.config.show_legend ? this.renderLegend(translations, colors) : html``}
        </div>
      </ha-card>
    `;
  }

  renderSubtitle(translations, attributes) {
    if (!this.config.show_next_mow) return "";

    if (attributes.next_mow_slot) {
      return `${t(translations, "subtitle_next_mow")}: ${attributes.next_mow_slot}`;
    }

    if (attributes.next_mow_day && attributes.next_mow_time) {
      return `${t(translations, "subtitle_next_mow")}: ${t(
        translations,
        attributes.next_mow_day
      )} ${attributes.next_mow_time}`;
    }

    const nextSlot = nextSlotFromCalendar(attributes);

    if (!nextSlot) return "";

    return `${t(translations, "subtitle_next_mow")}: ${t(
      translations,
      nextSlot.day
    )} ${nextSlot.slot}`;
  }

  renderDayRow(translations, attributes, day, colors) {
    const highlighted = this.config.highlight_today && day === todayKey();

    return html`
      <div class="row">
        <div
          class="day"
          style="background:${colors.day}; color:${colors.dayText};"
        >
          ${t(translations, day)}
        </div>

        <div
          class="track"
          style="
            border-color:${highlighted ? colors.todayBorder : "var(--divider-color)"};
            border-width:${highlighted ? "2px" : "1px"};
          "
        >
          <div class="line" style="left:25%;"></div>
          <div class="line" style="left:50%;"></div>
          <div class="line" style="left:75%;"></div>

          ${getSlotsForDay(attributes, day).map((slot) =>
            this.renderSlot(translations, slot, colors.slot)
          )}
          ${this.config.show_weather_exclusions
            ? getWeatherExclusionsForDay(attributes, day).map((slot) =>
                this.renderWeatherExclusion(translations, slot, colors.weatherExclusion)
              )
            : html``}
          ${this.renderNowLine(day, colors.now)}
        </div>
      </div>
    `;
  }

  renderSlot(translations, slot, color) {
    const position = slotPosition(slot);
    if (!position) return html``;

    return html`
      <div
        class="slot"
        title="${t(translations, "tooltip_mowing")}: ${slot}"
        style="
          left:${position.left}%;
          width:${position.width}%;
          background:${color};
        "
      ></div>
    `;
  }

  renderWeatherExclusion(translations, slot, color) {
    const position = slotPosition(slot);
    if (!position) return html``;

    return html`
      <div
        class="weather-exclusion"
        title="${t(translations, "tooltip_weather")}: ${slot}"
        style="
          left:${position.left}%;
          width:${position.width}%;
          background-color:${color};
        "
      ></div>
    `;
  }

  renderNowLine(day, color) {
    if (day !== todayKey()) return html``;

    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const left = (minutes / 1440) * 100;

    return html`
      <div
        class="now-line"
        style="left:${left}%; background:${color};"
      ></div>
    `;
  }

  renderLegend(translations, colors) {
    return html`
      <div class="legend">
        <div class="legend-item">
          <span class="legend-box" style="background:${colors.slot};"></span>
          <span>${t(translations, "legend_mowing")}</span>
        </div>

        <div class="legend-item">
          <span
            class="legend-box legend-weather"
            style="background-color:${colors.weatherExclusion};"
          ></span>
          <span>${t(translations, "legend_weather")}</span>
        </div>

        <div class="legend-item">
          <span class="legend-now" style="background:${colors.now};"></span>
          <span>${t(translations, "legend_now")}</span>
        </div>
      </div>
    `;
  }
}

if (!customElements.get("indego-calendar-card")) {
  customElements.define("indego-calendar-card", IndegoCalendarCard);
}
