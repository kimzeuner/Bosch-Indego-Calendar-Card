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
        highlight_today: "Highlight Today",
        entity_required: "Entity required",
        entity_not_found: "Entity not found",
        monday: "Mon",
        tuesday: "Tue",
        wednesday: "Wed",
        thursday: "Thu",
        friday: "Fri",
        saturday: "Sat",
        sunday: "Sun"
    },
    de: {
        title: "Kalender",
        title_field: "Titel",
        entity: "Entität",
        day_color: "Tagesfarbe",
        slot_color: "Mähfensterfarbe",
        now_color: "Aktuelle Zeit Farbe",
        today_border_color: "Rahmenfarbe Heute",
        highlight_today: "Heutigen Tag hervorheben",
        entity_required: "Entität erforderlich",
        entity_not_found: "Entität nicht gefunden",
        monday: "Mo",
        tuesday: "Di",
        wednesday: "Mi",
        thursday: "Do",
        friday: "Fr",
        saturday: "Sa",
        sunday: "So"
    }
    };
    static translate(lang, key) {
    return (
        IndegoCalendarCard.translations[lang]?.[key] ??
        IndegoCalendarCard.translations.en[key] ??
        key
    );
    }

    t(key) {
    return IndegoCalendarCard.translate(
        (this._hass?.language || "en").split("-")[0],
        key
    );
    }

    color(value, fallback) {
    if (!value) return fallback;

    if (typeof value === "string") return value;

    if (Array.isArray(value)) {
        return `rgb(${value[0]}, ${value[1]}, ${value[2]})`;
    }

    return fallback;
    }

    setConfig(config) {
        if (!config.entity) {
        throw new Error(this.t('entity_required'));
        }

        this.config = {
        ...config,
        title: config.title ?? null,
        day_color: config.day_color ?? [0, 122, 61],
        highlight_today: config.highlight_today ?? false,
        today_border_color: config.today_border_color ?? [255, 215, 0],
        slot_color: config.slot_color ?? [0, 122, 61],
        now_color: config.now_color ?? [166, 206, 57],
        };
    }

    

    set hass(hass) {
        this._hass = hass;

        const entity = hass.states[this.config.entity];

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

        const title =
            this.config.title ||
            this.t('title');

        const isToday = (day) => {
        const weekday = [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
        ][new Date().getDay()];

        return day === weekday;
        };

        const days = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
        ];

        const attr = entity.attributes;

        const slotHtml = (slot) => {
        if (!slot || slot === 'not_enabled') return '';

        const [start, end] = slot.split('-');
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);

        const startMin = sh * 60 + sm;
        const endMin = eh * 60 + em;

        const left = (startMin / 1440) * 100;
        const width = ((endMin - startMin) / 1440) * 100;

        return `
            <div class="slot" style="
            left:${left}%;
            width:${width}%;
            background:${slotColor};
            "></div>
        `;
        };

        const todayLine = (day) => {
        const weekday = [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
        ][new Date().getDay()];

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

            ${days.map((day) => `
            <div class="row">

                <div
                class="day"
                style="background:${dayColor};"
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

                    ${slotHtml(attr[`${day}_slot_1`])}
                    ${slotHtml(attr[`${day}_slot_2`])}
                    ${todayLine(day)}
                </div>

            </div>
            `).join('')}
            </div>
        </ha-card>

        <style>
            .card {
            padding: 16px;
            }

            .title {
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 12px;
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

            .now-line {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 3px;
            z-index: 5;
            }
        </style>
        `;
    }

    getCardSize() {
        return 4;
    }

    static getStubConfig() {
        return {
            entity: 'sensor.indego_122604270_calendar_slots',
            title: null,
            highlight_today: false,
            today_border_color: [255, 215, 0],
            day_color: [0, 122, 61],
            slot_color: [0, 122, 61],
            now_color: [166, 206, 57],
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
    day_color: this._config.day_color ?? [0, 122, 61],
    slot_color: this._config.slot_color ?? [0, 122, 61],
    now_color: this._config.now_color ?? [166, 206, 57],
    today_border_color: this._config.today_border_color ?? [255, 215, 0],
    };

    this._config = formData;
    form.data = formData;
    form.computeLabel = (schema) => schema.label || schema.name;
    const calendarEntities = Object.entries(this._hass.states)
    .filter(([entityId, state]) => {
        const a = state.attributes || {};

        return (
        a.monday_slot_1 !== undefined &&
        a.tuesday_slot_1 !== undefined &&
        a.wednesday_slot_1 !== undefined &&
        a.thursday_slot_1 !== undefined &&
        a.friday_slot_1 !== undefined &&
        a.saturday_slot_1 !== undefined &&
        a.sunday_slot_1 !== undefined
        );
    })
    .map(([entityId, state]) => ({
        value: entityId,
        label: state.attributes.friendly_name || entityId,
    }));

    // AUTO SELECT
    if (!this._config.entity && calendarEntities.length === 1) {
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
      selector: { color_rgb: {} }
    },
    {
      name: "slot_color",
      label: this.t("slot_color"),
      selector: { color_rgb: {} }
    }
  ]
},
{
  type: "grid",
  schema: [
    {
      name: "now_color",
      label: this.t("now_color"),
      selector: { color_rgb: {} }
    },
    {
      type: "constant",
      value: ""
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
      color_rgb: {}
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