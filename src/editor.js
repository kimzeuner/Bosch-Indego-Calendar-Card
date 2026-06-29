import { DEFAULT_CONFIG, getCalendarEntities } from "./helpers.js";
import { getTranslations, t } from "./translations.js";

class IndegoCalendarCardEditor extends HTMLElement {
  t(key) {
    return t(getTranslations(this._hass), key);
  }

  setConfig(config) {
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      entity: config.entity ?? DEFAULT_CONFIG.entity,
      title: config.title ?? DEFAULT_CONFIG.title,
    };

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

    this.innerHTML = "<ha-form></ha-form>";

    const form = this.querySelector("ha-form");
    const calendarEntities = getCalendarEntities(this._hass);

    this._form = form;

    form.hass = this._hass;
    form.computeLabel = (schema) => schema.label || schema.name;

    if (!this._config.entity && calendarEntities.length > 0) {
      this._config = {
        ...this._config,
        entity: calendarEntities[0].value,
      };
    }

    form.data = this._config;
    form.schema = [
      {
        name: "entity",
        label: this.t("entity"),
        required: true,
        selector: {
          select: {
            mode: "dropdown",
            options: calendarEntities,
          },
        },
      },
      {
        name: "title",
        label: this.t("title_field"),
        selector: {
          text: {},
        },
      },
      {
        type: "grid",
        schema: [
          {
            name: "day_color",
            label: this.t("day_color"),
            selector: { text: {} },
          },
          {
            name: "day_text_color",
            label: this.t("day_text_color"),
            selector: { text: {} },
          },
        ],
      },
      {
        type: "grid",
        schema: [
          {
            name: "slot_color",
            label: this.t("slot_color"),
            selector: { text: {} },
          },
          {
            name: "now_color",
            label: this.t("now_color"),
            selector: { text: {} },
          },
        ],
      },
      {
        name: "highlight_today",
        label: this.t("highlight_today"),
        selector: {
          boolean: {},
        },
      },
      {
        name: "today_border_color",
        label: this.t("today_border_color"),
        selector: {
          text: {},
        },
      },
      {
        name: "show_weather_exclusions",
        label: this.t("show_weather_exclusions"),
        selector: {
          boolean: {},
        },
      },
      {
        name: "weather_exclusion_color",
        label: this.t("weather_exclusion_color"),
        selector: {
          text: {},
        },
      },
      {
        name: "show_next_mow",
        label: this.t("show_next_mow"),
        selector: {
          boolean: {},
        },
      },
      {
        name: "show_legend",
        label: this.t("show_legend"),
        selector: {
          boolean: {},
        },
      },
    ];

    form.addEventListener("value-changed", (ev) => {
      this._config = ev.detail.value;

      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: this._config },
          bubbles: true,
          composed: true,
        }),
      );
    });

    this._rendered = true;
  }
}

customElements.define("indego-calendar-card-editor", IndegoCalendarCardEditor);
