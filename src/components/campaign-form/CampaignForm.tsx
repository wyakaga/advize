"use client";

import { useState, SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  DateField,
  DatePicker,
  Label,
  ListBox,
  Select,
  Spinner,
} from "@heroui/react";
import {
  today,
  getLocalTimeZone,
  DateValue,
  isToday,
} from "@internationalized/date";

import { useCreateCampaignMutation } from "@/app/services/campaigns";

const PLATFORMS = ["Facebook", "Google", "TikTok", "LinkedIn"] as const;

export function CampaignForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createMutation = useCreateCampaignMutation();

  const now = today(getLocalTimeZone());

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name") as string,
      platform: form.get("platform") as string,
      impressions: Number(form.get("impressions")),
      clicks: Number(form.get("clicks")),
      conversions: Number(form.get("conversions")),
      cost: Number(form.get("cost")),
      startDate: form.get("startDate") as string,
      endDate: form.get("endDate") as string,
    };

    // Basic validation
    if (
      !payload.name ||
      !payload.platform ||
      !payload.startDate ||
      !payload.endDate
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        setTimeout(() => router.push("/dashboard"), 1500);
      },
      onError: () => {
        setError("Something went wrong. Please try again.");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Campaign name */}
      <div>
        <label htmlFor="name" className="form-label">
          Campaign name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="e.g., Summer Sale 2026"
          required
          className="form-input"
        />
      </div>

      <Select
        placeholder="Select platform"
        id="platform"
        name="platform"
        variant="secondary"
      >
        <Label>Platform</Label>
        <Select.Trigger className="form-select">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>

        <Select.Popover>
          <ListBox>
            {PLATFORMS.map((p) => (
              <ListBox.Item id={p} key={p} textValue={p}>
                {p}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="impressions" className="form-label">
            Impressions
          </label>
          <input
            type="number"
            id="impressions"
            name="impressions"
            min="0"
            placeholder="0"
            required
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="clicks" className="form-label">
            Clicks
          </label>
          <input
            type="number"
            id="clicks"
            name="clicks"
            min="0"
            placeholder="0"
            required
            className="form-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="conversions" className="form-label">
            Conversions
          </label>
          <input
            type="number"
            id="conversions"
            name="conversions"
            min="0"
            placeholder="0"
            required
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="cost" className="form-label">
            Cost (USD)
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            min="0"
            step="0.01"
            placeholder="0.00"
            required
            className="form-input"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <DatePicker name="startDate" id="startDate" maxValue={now}>
          <Label className="form-label">Start Date</Label>
          <DateField.Group
            fullWidth
            className="form-input h-11"
            variant="secondary"
          >
            <DateField.Input>
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateField.Suffix>
              <DatePicker.Trigger>
                <DatePicker.TriggerIndicator />
              </DatePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <DatePicker.Popover>
            <Calendar aria-label="Start date">
              <Calendar.Header>
                <Calendar.YearPickerTrigger>
                  <Calendar.YearPickerTriggerHeading />
                  <Calendar.YearPickerTriggerIndicator />
                </Calendar.YearPickerTrigger>
                <Calendar.NavButton slot="previous" />
                <Calendar.NavButton slot="next" />
              </Calendar.Header>
              <Calendar.Grid>
                <Calendar.GridHeader>
                  {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                </Calendar.GridHeader>
                <Calendar.GridBody>
                  {(date) => (
                    <Calendar.Cell
                      date={date}
                      className={"data-[today=true]:text-coral"}
                    />
                  )}
                </Calendar.GridBody>
              </Calendar.Grid>
              <Calendar.YearPickerGrid>
                <Calendar.YearPickerGridBody>
                  {({ year }) => <Calendar.YearPickerCell year={year} />}
                </Calendar.YearPickerGridBody>
              </Calendar.YearPickerGrid>
            </Calendar>
          </DatePicker.Popover>
        </DatePicker>

        <DatePicker
          name="endDate"
          id="endDate"
          maxValue={today(getLocalTimeZone())}
        >
          <Label className="form-label">End Date</Label>
          <DateField.Group
            fullWidth
            className="form-input h-11"
            variant="secondary"
          >
            <DateField.Input>
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateField.Suffix>
              <DatePicker.Trigger>
                <DatePicker.TriggerIndicator />
              </DatePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <DatePicker.Popover>
            <Calendar aria-label="End date">
              <Calendar.Header>
                <Calendar.YearPickerTrigger>
                  <Calendar.YearPickerTriggerHeading />
                  <Calendar.YearPickerTriggerIndicator />
                </Calendar.YearPickerTrigger>
                <Calendar.NavButton slot="previous" />
                <Calendar.NavButton slot="next" />
              </Calendar.Header>
              <Calendar.Grid>
                <Calendar.GridHeader>
                  {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                </Calendar.GridHeader>
                <Calendar.GridBody>
                  {(date) => (
                    <Calendar.Cell
                      date={date}
                      className={"data-[today=true]:text-coral"}
                    />
                  )}
                </Calendar.GridBody>
              </Calendar.Grid>
              <Calendar.YearPickerGrid>
                <Calendar.YearPickerGridBody>
                  {({ year }) => <Calendar.YearPickerCell year={year} />}
                </Calendar.YearPickerGridBody>
              </Calendar.YearPickerGrid>
            </Calendar>
          </DatePicker.Popover>
        </DatePicker>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "#D64545" }}>
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm" style={{ color: "var(--color-mint)" }}>
          Campaign saved. Redirecting to dashboard...
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="btn-primary mt-2 flex items-center justify-center gap-2"
        disabled={createMutation.isPending}
        id="save-campaign-btn"
      >
        {createMutation.isPending ? <Spinner size="sm" /> : null}
        {createMutation.isPending ? "Saving..." : "Save campaign"}
      </button>
    </form>
  );
}
