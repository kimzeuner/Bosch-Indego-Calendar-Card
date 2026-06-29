export const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DEFAULT_CONFIG = {
  entity: null,
  title: null,
  day_color: "#007a3d",
  highlight_today: false,
  today_border_color: "#ffd700",
  slot_color: "#007a3d",
  now_color: "#a6ce39",
  day_text_color: "#ffffff",
  weather_exclusion_color: "rgba(80, 160, 255, 0.35)",
  show_weather_exclusions: true,
  show_next_mow: true,
  show_legend: true,
};

export function color(value, fallback) {
  if (!value) return fallback;

  if (Array.isArray(value)) {
    if (value.length >= 4) {
      return `rgba(${value[0]}, ${value[1]}, ${value[2]}, ${value[3]})`;
    }

    return `rgb(${value[0]}, ${value[1]}, ${value[2]})`;
  }

  if (typeof value !== "string") return fallback;

  const colorValue = value.trim();

  if (!colorValue) return fallback;

  if (colorValue.startsWith("--")) {
    return `var(${colorValue})`;
  }

  if (colorValue.startsWith("var(")) {
    return colorValue;
  }

  if (
    typeof CSS !== "undefined" &&
    CSS.supports &&
    CSS.supports("color", colorValue)
  ) {
    return colorValue;
  }

  return `var(--${colorValue})`;
}

export function normalizeSlots(value) {
  if (
    !value ||
    value === "not_enabled" ||
    value === "not_scheduled" ||
    value === "none"
  ) {
    return [];
  }

  return String(value)
    .split(",")
    .map((slot) => slot.trim())
    .filter(
      (slot) =>
        slot &&
        slot !== "not_enabled" &&
        slot !== "not_scheduled" &&
        slot !== "none",
    );
}

export function hasCalendarEntityAttributes(attributes = {}) {
  const hasCalendarSlots =
    attributes.monday_slot_1 !== undefined &&
    attributes.tuesday_slot_1 !== undefined &&
    attributes.wednesday_slot_1 !== undefined &&
    attributes.thursday_slot_1 !== undefined &&
    attributes.friday_slot_1 !== undefined &&
    attributes.saturday_slot_1 !== undefined &&
    attributes.sunday_slot_1 !== undefined;

  const hasPredictiveSchedule =
    attributes.schedule_monday !== undefined &&
    attributes.schedule_tuesday !== undefined &&
    attributes.schedule_wednesday !== undefined &&
    attributes.schedule_thursday !== undefined &&
    attributes.schedule_friday !== undefined &&
    attributes.schedule_saturday !== undefined &&
    attributes.schedule_sunday !== undefined;

  return hasCalendarSlots || hasPredictiveSchedule;
}

export function findCalendarEntity(hass, configuredEntityId) {
  let entityId = configuredEntityId;
  let entity = hass.states[entityId];

  if (entity) {
    return { entityId, entity };
  }

  const fallbackEntityId = Object.keys(hass.states).find((candidateEntityId) =>
    hasCalendarEntityAttributes(hass.states[candidateEntityId].attributes),
  );

  if (!fallbackEntityId) {
    return { entityId, entity: undefined };
  }

  return {
    entityId: fallbackEntityId,
    entity: hass.states[fallbackEntityId],
  };
}

export function getSlotsForDay(attributes, day) {
  const predictiveSchedule = attributes[`schedule_${day}`];

  if (predictiveSchedule !== undefined) {
    return normalizeSlots(predictiveSchedule);
  }

  return [
    ...normalizeSlots(attributes[`${day}_slot_1`]),
    ...normalizeSlots(attributes[`${day}_slot_2`]),
  ];
}

export function getWeatherExclusionsForDay(attributes, day) {
  return normalizeSlots(attributes[`exclusion_${day}_weather`]);
}

export function isToday(day) {
  const weekday = DAYS[(new Date().getDay() + 6) % 7];
  return day === weekday;
}

export function slotToPosition(slot) {
  if (!slot || !slot.includes("-")) return null;

  const [start, end] = slot.split("-").map((part) => part.trim());
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;

  if (Number.isNaN(startMin) || Number.isNaN(endMin) || endMin <= startMin) {
    return null;
  }

  return {
    left: (startMin / 1440) * 100,
    width: ((endMin - startMin) / 1440) * 100,
  };
}

export function getNextSlotFromCalendar(attributes) {
  const now = new Date();
  const todayIndex = (now.getDay() + 6) % 7;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (let offset = 0; offset < 7; offset += 1) {
    const dayIndex = (todayIndex + offset) % 7;
    const day = DAYS[dayIndex];
    const slots = getSlotsForDay(attributes, day);

    for (const slot of slots) {
      if (!slot || !slot.includes("-")) continue;

      const [start] = slot.split("-").map((part) => part.trim());
      const [sh, sm] = start.split(":").map(Number);
      const startMinutes = sh * 60 + sm;

      if (offset === 0 && startMinutes <= nowMinutes) {
        continue;
      }

      return { day, slot };
    }
  }

  return null;
}

export function getCalendarEntities(hass) {
  return Object.entries(hass.states)
    .filter(([, state]) => hasCalendarEntityAttributes(state.attributes))
    .map(([entityId, state]) => ({
      value: entityId,
      label: state.attributes.friendly_name || entityId,
    }));
}
