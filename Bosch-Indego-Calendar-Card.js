class IndegoCalendarCard extends HTMLElement {
    static translations = {
      en: {
          title: "Calendar",
          title_field: "Title",
          entity: "Entity",
          day_color: "Day Color",
          slot_color: "Slot Color",
          now_color: "Current Time Color",
          today_border_color: "Today Border Color",
          day_text_color: "Day Text Color",
          weather_exclusion_color: "Weather Exclusion Color",
          highlight_today: "Highlight Today",
          entity_required: "Entity required",
          entity_not_found: "Entity not found",
          monday: "Mon",
          tuesday: "Tue",
          wednesday: "Wed",
          thursday: "Thu",
          friday: "Fri",
          saturday: "Sat",
          sunday: "Sun",
          subtitle_next_mow: "Next mow",
          show_next_mow: "Show Next Mow",
          show_legend: "Show Legend",
          legend_mowing: "Mowing window",
          legend_weather: "Weather exclusion",
          legend_now: "Current time",
          tooltip_mowing: "Mowing window",
          tooltip_weather: "Weather exclusion"
      },
      de: {
          title: "Kalender",
          title_field: "Titel",
          entity: "Entität",
          day_color: "Tagesfarbe",
          slot_color: "Mähfensterfarbe",
          now_color: "Aktuelle Zeit Farbe",
          today_border_color: "Rahmenfarbe Heute",
          day_text_color: "Textfarbe Tag",
          weather_exclusion_color: "Wettersperrzeit Farbe",
          highlight_today: "Heutigen Tag hervorheben",
          entity_required: "Entität erforderlich",
          entity_not_found: "Entität nicht gefunden",
          monday: "Mo",
          tuesday: "Di",
          wednesday: "Mi",
          thursday: "Do",
          friday: "Fr",
          saturday: "Sa",
          sunday: "So",
          subtitle_next_mow: "Nächster Mähslot",
          show_next_mow: "Nächsten Mähslot anzeigen",
          show_legend: "Legende anzeigen",
          legend_mowing: "Mähfenster",
          legend_weather: "Wettersperrzeit",
          legend_now: "Aktuelle Zeit",
          tooltip_mowing: "Mähfenster",
          tooltip_weather: "Wettersperrzeit"
      }
    };

    static translate(lang, key) {
      return (
          IndegoCalendarCard.translations[lang]?.[key] ??
          IndegoCalendarCard.translations.en[key] ??
          key
      );
    }

    static DAYS = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    t(key) {
      return IndegoCalendarCard.translate(
          (this._hass?.language || "en").split("-")[0],
          key
      );
    }

    color(value, fallback) {

      if (!value) 
        return fallback;

      if (Array.isArray(value)) {
          if (value.length >= 4) {
              return `rgba(${value[0]}, ${value[1]}, ${value[2]}, ${value[3]})`;
          }

          return `rgb(${value[0]}, ${value[1]}, ${value[2]})`;
      }

      if (typeof value !== "string") 
        return fallback;

      const color = value.trim();

      if (!color) 
        return fallback;

      if (color.startsWith("--")) {
          return `var(${color})`;
      }

      if (color.startsWith("var(")) {
          return color;
      }

      if (typeof CSS !== "undefined" && CSS.supports && CSS.supports("color", color)) {
          return color;
      }

      return `var(--${color})`;
    }

    setConfig(config) {
        if (!config.entity) {
          throw new Error(this.t('entity_required'));
        }

        this.config = {
          ...config,
          title: config.title ?? null,
          day_color: config.day_color ?? "#007a3d",
          highlight_today: config.highlight_today ?? false,
          today_border_color: config.today_border_color ?? "#ffd700",
          slot_color: config.slot_color ?? "#007a3d",
          now_color: config.now_color ?? "#a6ce39",
          day_text_color: config.day_text_color ?? "#ffffff",
          weather_exclusion_color: config.weather_exclusion_color ?? "rgba(80, 160, 255, 0.35)",
          show_weather_exclusions: config.show_weather_exclusions ?? true,
          show_next_mow: config.show_next_mow ?? true,
          show_legend: config.show_legend ?? true,
        };
    }

    

    set hass(hass) {
      this._hass = hass;

        let entityId = this.config.entity;
        let entity = hass.states[entityId];
        
        if (!entity) {
            const fallbackEntityId = Object.keys(hass.states).find((entityId) => {
                const a = hass.states[entityId].attributes || {};
        
                const hasCalendarSlots =
                    a.monday_slot_1 !== undefined &&
                    a.tuesday_slot_1 !== undefined &&
                    a.wednesday_slot_1 !== undefined &&
                    a.thursday_slot_1 !== undefined &&
                    a.friday_slot_1 !== undefined &&
                    a.saturday_slot_1 !== undefined &&
                    a.sunday_slot_1 !== undefined;
        
                const hasPredictiveSchedule =
                    a.schedule_monday !== undefined &&
                    a.schedule_tuesday !== undefined &&
                    a.schedule_wednesday !== undefined &&
                    a.schedule_thursday !== undefined &&
                    a.schedule_friday !== undefined &&
                    a.schedule_saturday !== undefined &&
                    a.schedule_sunday !== undefined;
        
                return hasCalendarSlots || hasPredictiveSchedule;
            });
        
            if (fallbackEntityId) {
                entityId = fallbackEntityId;
                entity = hass.states[fallbackEntityId];
            }
        }

      if (!entity) {

        this.innerHTML = `
            <ha-card>
            <div style="padding:16px;">
                ${this.t('entity_not_found')}: ${this.config.entity}
            </div>
            </ha-card>
        `;
      return;
      }

      const dayColor = this.color(this.config.day_color, "#007a3d");
      const slotColor = this.color(this.config.slot_color, "#007a3d");
      const nowColor = this.color(this.config.now_color, "#a6ce39");
      const todayBorderColor = this.color(this.config.today_border_color, "#ffd700");
      const dayTextColor = this.color(this.config.day_text_color, "#ffffff");
      const weatherExclusionColor = this.color(this.config.weather_exclusion_color, "rgba(80, 160, 255, 0.35)");

      const attr = entity.attributes;

      const title =
          this.config.title ||
          this.t('title');

      const subtitle = (() => {
        if (!this.config.show_next_mow) return '';

      const nextMowSlot = attr.next_mow_slot;
      const nextMowDay = attr.next_mow_day;
      const nextMowTime = attr.next_mow_time;

      if (nextMowSlot) {
          return `${this.t('subtitle_next_mow')}: ${nextMowSlot}`;
      }

      if (nextMowDay && nextMowTime) {
          return `${this.t('subtitle_next_mow')}: ${this.t(nextMowDay)} ${nextMowTime}`;
      }

      return '';
    })();

      const isToday = (day) => {
      const weekday = IndegoCalendarCard.DAYS[
        (new Date().getDay() + 6) % 7
      ];

      return day === weekday;
      };

      const normalizeSlots = (value) => {
      if (!value || value === 'not_enabled' || value === 'not_scheduled' || value === 'none') {
          return [];
      }

      return String(value)
          .split(',')
          .map((slot) => slot.trim())
          .filter((slot) =>
              slot &&
              slot !== 'not_enabled' &&
              slot !== 'not_scheduled' &&
              slot !== 'none'
          );
      };

      const getSlotsForDay = (day) => {
      const predictiveSchedule = attr[`schedule_${day}`];

      if (predictiveSchedule !== undefined) {
          return normalizeSlots(predictiveSchedule);
      }

      return [
          ...normalizeSlots(attr[`${day}_slot_1`]),
          ...normalizeSlots(attr[`${day}_slot_2`]),
      ];
      };

      const getWeatherExclusionsForDay = (day) => {
          return normalizeSlots(attr[`exclusion_${day}_weather`]);
      };

      const slotHtml = (slot) => {
          if (!slot || !slot.includes('-')) return '';

          const [start, end] = slot.split('-').map((part) => part.trim());

          const [sh, sm] = start.split(':').map(Number);
          const [eh, em] = end.split(':').map(Number);

          const startMin = sh * 60 + sm;
          const endMin = eh * 60 + em;

          if (endMin <= startMin) return '';

          const left = (startMin / 1440) * 100;
          const width = ((endMin - startMin) / 1440) * 100;

          return `
            <div
                class="slot"
                title="${this.t('tooltip_mowing')}: ${slot}"
                style="
                    left:${left}%;
                    width:${width}%;
                    background:${slotColor};
                "
            ></div>
          `;
      };

      const exclusionHtml = (slot, color) => {
          if (!slot || !slot.includes('-')) return '';

          const [start, end] = slot.split('-').map((part) => part.trim());

          const [sh, sm] = start.split(':').map(Number);
          const [eh, em] = end.split(':').map(Number);

          const startMin = sh * 60 + sm;
          const endMin = eh * 60 + em;

          if (endMin <= startMin) return '';

          const left = (startMin / 1440) * 100;
          const width = ((endMin - startMin) / 1440) * 100;

          return `
            <div
                class="weather-exclusion"
                title="${this.t('tooltip_weather')}: ${slot}"
                style="
                    left:${left}%;
                    width:${width}%;
                    background-color:${color};
                "
            ></div>
          `;
      };

      const todayLine = (day) => {
      const weekday = IndegoCalendarCard.DAYS[
        (new Date().getDay() + 6) % 7
      ];

      if (day !== weekday) return '';

      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      const left = (minutes / 1440) * 100;

      return `
          <div class="now-line" style="
          left:${left}%;
          background:${nowColor};
          "></div>
      `;
      };

      this.innerHTML = `
      <ha-card>
          <div class="card">
          <div class="title">${title}</div>
          ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}

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

          ${IndegoCalendarCard.DAYS.map((day) => `
          <div class="row">

              <div
              class="day"
              style="background:${dayColor};
              color:${dayTextColor};"
              >
              ${this.t(day)}
              </div>

              <div
                  class="track"
                  style="
                      border-color:${
                      this.config.highlight_today && isToday(day)
                          ? todayBorderColor
                          : 'var(--divider-color)'
                      };
                      border-width:${
                      this.config.highlight_today && isToday(day)
                          ? '2px'
                          : '1px'
                      };
                  "
              >
                  <div class="line" style="left:25%;"></div>
                  <div class="line" style="left:50%;"></div>
                  <div class="line" style="left:75%;"></div>

                  ${getSlotsForDay(day).map(slot => slotHtml(slot)).join('')}
                  ${this.config.show_weather_exclusions
                      ? getWeatherExclusionsForDay(day).map(slot => exclusionHtml(slot, weatherExclusionColor)).join('')
                      : ''
                  }
                  ${todayLine(day)}
              </div>

          </div>
          `).join('')}

          ${this.config.show_legend ? `
          <div class="legend">
              <div class="legend-item">
                  <span class="legend-box legend-slot" style="background:${slotColor};"></span>
                  <span>${this.t('legend_mowing')}</span>
              </div>

              <div class="legend-item">
                  <span class="legend-box legend-weather" style="--weather-exclusion-color:${weatherExclusionColor};"></span>
                  <span>${this.t('legend_weather')}</span>
              </div>

              <div class="legend-item">
                  <span class="legend-now" style="background:${nowColor};"></span>
                  <span>${this.t('legend_now')}</span>
              </div>
          </div>
          ` : ''}

          </div>
      </ha-card>

      <style>
          .card {
            padding: 16px;
          }

          .title {
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 2px;
          }

          .subtitle {
              margin-top: 0;
              margin-bottom: 14px;
              color: var(--secondary-text-color);
              font-size: 13px;
          }

          .scale {
            display: grid;
            grid-template-columns: 44px 1fr;
            margin-bottom: 8px;
            color: var(--secondary-text-color);
            font-size: 13px;
          }

          .scale-inner {
            position: relative;
            height: 18px;
          }

          .scale-inner span {
            position: absolute;
            transform: translateX(-50%);
          }

          .row {
            display: grid;
            grid-template-columns: 44px 1fr;
            height: 44px;
            margin-bottom: 10px;
          }

          .day {
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 18px 0 0 18px;
            font-weight: 600;
          }

          .track {
            position: relative;
            height: 44px;
            border: 1px solid var(--divider-color);
            border-left: none;
            border-radius: 0 18px 18px 0;
            overflow: hidden;
            background: var(--card-background-color);
          }

          .line {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 1px;
            background: var(--divider-color);
            z-index: 1;
          }

          .slot {
            position: absolute;
            top: 0;
            bottom: 0;
            border-radius: 16px;
            z-index: 2;
          }

          .weather-exclusion {
              position: absolute;
              top: 6px;
              bottom: 6px;
              border-radius: 12px;
              z-index: 4;

              background-image:
                  repeating-linear-gradient(
                      45deg,
                      rgba(255,255,255,0.0) 0px,
                      rgba(255,255,255,0.0) 4px,
                      rgba(255,255,255,0.4) 4px,
                      rgba(255,255,255,0.4) 8px
                  );
          }

          .now-line {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 3px;
            z-index: 5;
          }

          .legend {
              display: flex;
              flex-wrap: wrap;
              gap: 12px;
              margin-top: 12px;
              color: var(--secondary-text-color);
              font-size: 12px;
          }

          .legend-item {
              display: flex;
              align-items: center;
              gap: 6px;
          }

          .legend-box {
              width: 22px;
              height: 10px;
              border-radius: 5px;
              display: inline-block;
          }

          .legend-weather {
              background-color: var(--weather-exclusion-color);
              background-image:
                  repeating-linear-gradient(
                      45deg,
                      rgba(255,255,255,0.0) 0px,
                      rgba(255,255,255,0.0) 4px,
                      rgba(255,255,255,0.4) 4px,
                      rgba(255,255,255,0.4) 8px
                  );
          }

          .legend-now {
              width: 3px;
              height: 14px;
              border-radius: 2px;
              display: inline-block;
          }
      </style>
      `;
    }

    getCardSize() {
        return 4;
    }

    static getStubConfig() {
        return {
            entity: null,
            title: null,
            highlight_today: false,
            today_border_color: "#ffd700",
            day_color: "#007a3d",
            slot_color: "#007a3d",
            now_color: "#a6ce39",
            day_text_color: "#ffffff",
            show_weather_exclusions: true,
            weather_exclusion_color: "rgba(80, 160, 255, 0.35)",
            show_next_mow: true,
            show_legend: true,
        };
    }

    static getConfigElement() {
        return document.createElement('indego-calendar-card-editor');
    }
}

class IndegoCalendarCardEditor extends HTMLElement {

    t(key) {
    return IndegoCalendarCard.translate(
        (this._hass?.language || "en").split("-")[0],
        key
    );
    }

    setConfig(config) {
    this._config = config;

    if (!this._rendered) {
        this.render();
    } else if (this._form) {
        this._form.data = this._config;
    }
    }

    set hass(hass) {
    this._hass = hass;

    if (!this._rendered) {
        this.render();
    } else if (this._form) {
        this._form.hass = hass;
    }
    }

  render() {
    if (!this._hass || !this._config) return;

    this.innerHTML = `
      <ha-form></ha-form>
    `;

    const form = this.querySelector('ha-form');
    this._form = form;

    form.hass = this._hass;
    const formData = {
      ...this._config,
      day_color: this._config.day_color ?? "#007a3d",
      slot_color: this._config.slot_color ?? "#007a3d",
      now_color: this._config.now_color ?? "#a6ce39",
      day_text_color: this._config.day_text_color ?? "#ffffff",
      today_border_color: this._config.today_border_color ?? "#ffd700",
      show_next_mow: this._config.show_next_mow ?? true,
      show_legend: this._config.show_legend ?? true,
      show_weather_exclusions: this._config.show_weather_exclusions ?? true,
      weather_exclusion_color: this._config.weather_exclusion_color ?? "rgba(80, 160, 255, 0.35)",

    };

    this._config = formData;
    form.data = formData;
    form.computeLabel = (schema) => schema.label || schema.name;
    const calendarEntities = Object.entries(this._hass.states)
    .filter(([entityId, state]) => {
        const a = state.attributes || {};

        const hasCalendarSlots =
        a.monday_slot_1 !== undefined &&
        a.tuesday_slot_1 !== undefined &&
        a.wednesday_slot_1 !== undefined &&
        a.thursday_slot_1 !== undefined &&
        a.friday_slot_1 !== undefined &&
        a.saturday_slot_1 !== undefined &&
        a.sunday_slot_1 !== undefined;

        const hasPredictiveSchedule =
        a.schedule_monday !== undefined &&
        a.schedule_tuesday !== undefined &&
        a.schedule_wednesday !== undefined &&
        a.schedule_thursday !== undefined &&
        a.schedule_friday !== undefined &&
        a.schedule_saturday !== undefined &&
        a.schedule_sunday !== undefined;

        return hasCalendarSlots || hasPredictiveSchedule;
    })
    .map(([entityId, state]) => ({
        value: entityId,
        label: state.attributes.friendly_name || entityId,
    }));

    // AUTO SELECT
    if (!this._config.entity && calendarEntities.length > 0) {
        this._config = {
            ...this._config,
            entity: calendarEntities[0].value,
        };
    
        form.data = this._config;
    }
      
form.schema = [
  {
    name: "entity",
    label: this.t("entity"),
    required: true,
    selector: {
      select: {
        mode: "dropdown",
        options: calendarEntities
      }
    }
  },
  {
    name: "title",
    label: this.t("title_field"),
    selector: {
      text: {}
    }
  },
{
  type: "grid",
  schema: [
    {
      name: "day_color",
      label: this.t("day_color"),
      selector: { text: {} }
    },
    {
      name: "day_text_color",
      label: this.t("day_text_color"),
      selector: { text: {} }
    }
  ]
},
{
  type: "grid",
  schema: [
    {
      name: "slot_color",
      label: this.t("slot_color"),
      selector: { text: {} }
    },
    {
      name: "now_color",
      label: this.t("now_color"),
      selector: { text: {} }
    }
  ]
},
  {
    name: "highlight_today",
    label: this.t("highlight_today"),
    selector: {
      boolean: {}
    }
  },
  {
    name: "today_border_color",
    label: this.t("today_border_color"),
    selector: {
      text: {}
    }
  },
  {
    name: "show_weather_exclusions",
    label: "Weather Exclusions anzeigen",
    selector: {
      boolean: {}
    }
  },
  {
    name: "weather_exclusion_color",
    label: this.t("weather_exclusion_color"),
    selector: {
      text: {}
    }
  },
  {
    name: "show_next_mow",
    label: this.t("show_next_mow"),
    selector: {
      boolean: {}
    }
  },
  {
    name: "show_legend",
    label: this.t("show_legend"),
    selector: {
      boolean: {}
    }
  }
];

form.addEventListener("value-changed", (ev) => {
  this._config = ev.detail.value;

  this.dispatchEvent(new CustomEvent("config-changed", {
    detail: { config: this._config },
    bubbles: true,
    composed: true,
  }));
});
this._rendered = true;
  }
}

customElements.define('indego-calendar-card-editor', IndegoCalendarCardEditor);

customElements.define('indego-calendar-card', IndegoCalendarCard);
window.customCards = window.customCards || [];

window.customCards.push({
    type: 'indego-calendar-card',
    name: 'Indego Calendar',
    description: 'Displays scheduled mowing windows as a weekly calendar.',
    preview: true,
});
