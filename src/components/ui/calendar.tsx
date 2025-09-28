import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cs } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={cs}
      className={cn("p-3 w-full", className)}
      classNames={{
        months: "w-full flex flex-col sm:flex-row sm:justify-center space-y-3 sm:space-x-6 sm:space-y-0",
        month: "space-y-3",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-base font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-60 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full",
        head_cell: "flex-1 text-center text-muted-foreground rounded-md font-normal text-[0.82rem] md:text-sm",
        row: "flex w-full mt-1",
        cell: "flex-1 text-center text-sm p-0 relative flex items-center justify-center [&:has([aria-selected].day-range-end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 sm:h-10 sm:w-10 md:h-10 md:w-10 lg:h-10 lg:w-10 p-0 font-normal aria-selected:opacity-100",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "ring-1 ring-accent text-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-primary/20 aria-selected:text-foreground aria-selected:opacity-100",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
