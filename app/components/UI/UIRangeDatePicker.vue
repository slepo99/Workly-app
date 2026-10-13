<script setup lang="ts">
import {
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  type DateValue,
} from "@internationalized/date";
import type { DateRange } from "reka-ui";
import { DATE_LOCALES } from "~/constants/locale";

type DateRangeModel = {
  start: string;
  end: string;
};

const modelValue = defineModel<DateRangeModel>({
  required: true,
});

const { locale, t } = useI18n();

const dateLocale = computed(() => {
  return DATE_LOCALES[locale.value as keyof typeof DATE_LOCALES];
});

const df = computed(
  () =>
    new DateFormatter(dateLocale.value, {
      dateStyle: "medium",
    }),
);

const tz = getLocalTimeZone();

function toISOString(value: DateValue) {
  return new Date(
    Date.UTC(value.year, value.month - 1, value.day),
  ).toISOString();
}

const calendarValue = computed<DateRange | undefined>(() => {
  const { start, end } = modelValue.value;

  if (!start && !end) {
    return undefined;
  }

  return {
    start: start ? parseDate(start.slice(0, 10)) : undefined,
    end: end ? parseDate(end.slice(0, 10)) : undefined,
  };
});

function onCalendarChange(value: DateRange | null | undefined) {
  modelValue.value = {
    start: value?.start ? toISOString(value.start) : "",
    end: value?.end ? toISOString(value.end) : "",
  };
}

const label = computed(() => {
  const start = calendarValue.value?.start;
  const end = calendarValue.value?.end;

  if (!start) {
    return t("UI.datePicker.placeholder");
  }

  if (!end) {
    return df.value.format(start.toDate(tz));
  }

  return `${df.value.format(start.toDate(tz))} - ${df.value.format(
    end.toDate(tz),
  )}`;
});
</script>

<template>
  <UPopover :content="{ align: 'center' }">
    <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
      {{ label }}
    </UButton>

    <template #content>
      <UCalendar
        :model-value="calendarValue"
        range
        class="p-2"
        @update:model-value="onCalendarChange"
      />
    </template>
  </UPopover>
</template>
