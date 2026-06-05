// import {
// 	eachDayOfInterval,
// 	eachMonthOfInterval,
// 	eachHourOfInterval,
// 	endOfDay,
// 	endOfMonth,
// 	endOfWeek,
// 	endOfYear,
// 	startOfDay,
// 	startOfMonth,
// 	startOfWeek,
// 	startOfYear,
// 	subDays,
// } from "date-fns";
// import { format } from "date-fns";
// import { QuickTooltip } from "@/components/ui/tooltip";
// import { useTheme } from "@/context/theme-context";
// import { motion, AnimatePresence } from "framer-motion";

// type View = "day" | "week" | "month" | "year" | "30-days" | "7-days";

// type Label = {
// 	key: string;
// 	label: string;
// };

// type Data = {
// 	[key: string]: {
// 		[key: string]: number;
// 	};
// };

// type MatrixChart = {
// 	view: View;
// 	labels: Label[] | string[];
// 	data: Data;
// 	getColorForBox?: (value: number) => string;
// };

// function getXAxisValues(view: View): string[] {
// 	switch (view) {
// 		case "day":
// 			const startOfDayValue = startOfDay(new Date());
// 			const endOfDayValue = endOfDay(new Date());
// 			return eachHourOfInterval({ start: startOfDayValue, end: endOfDayValue }).map((hour) =>
// 				format(hour, "HH:mm"),
// 			);
// 		case "week":
// 			const startOfWeekValue = startOfWeek(new Date(), { weekStartsOn: 1 });
// 			const endOfWeekValue = endOfWeek(new Date(), { weekStartsOn: 1 });
// 			return eachDayOfInterval({ start: startOfWeekValue, end: endOfWeekValue }).map((day) =>
// 				format(day, "ccc "),
// 			);
// 		case "month":
// 			const startOfMonthValue = startOfMonth(new Date());
// 			const endOfMonthValue = endOfMonth(new Date());
// 			return eachDayOfInterval({ start: startOfMonthValue, end: endOfMonthValue }).map(
// 				(day) => format(day, "dd"),
// 			);
// 		case "year":
// 			const startOfYearValue = startOfYear(new Date());
// 			const endOfYearValue = endOfYear(new Date());
// 			return eachMonthOfInterval({ start: startOfYearValue, end: endOfYearValue }).map(
// 				(day) => format(day, "MMM"),
// 			);
// 		case "30-days":
// 			const startOf30DaysValue = startOfDay(new Date());
// 			const endOf30DaysValue = subDays(startOf30DaysValue, 29);
// 			return eachDayOfInterval({ start: startOf30DaysValue, end: endOf30DaysValue }).map(
// 				(day) => format(day, "dd"),
// 			);
// 		case "7-days":
// 			const startOf7DaysValue = startOfDay(new Date());
// 			const endOf7DaysValue = subDays(startOf7DaysValue, 6);
// 			return eachDayOfInterval({ start: startOf7DaysValue, end: endOf7DaysValue }).map(
// 				(day) => format(day, "ccc"),
// 			);
// 	}
// }

// export function MatrixChart({ view = "day", labels = [], data = {}, getColorForBox }: MatrixChart) {
// 	const xAxisValues = getXAxisValues(view);
// 	const { isDarkMode } = useTheme();

// 	return (
// 		<div>
// 			<div className="flex flex-col gap-2 overflow-x-auto w-full">
// 				{labels.map((label) => {
// 					const _label = typeof label === "string" ? label : label.label;
// 					const _labelKey = typeof label === "string" ? label : label.key;
// 					return (
// 						<div
// 							key={_labelKey}
// 							className="text-sm text-muted-foreground flex flex-row gap-3 w-full items-center"
// 						>
// 							<QuickTooltip title={_label}>
// 								<span className="min-w-32 truncate whitespace-nowrap">
// 									{_label}
// 								</span>
// 							</QuickTooltip>
// 							<div className="flex flex-row gap-2 flex-1 ">
// 								<AnimatePresence mode="wait">
// 									{xAxisValues.map((value, index) => {
// 										const valueToShow = data?.[_labelKey]?.[value.trim()] || 0;
// 										return (
// 											<motion.div
// 												key={`${_labelKey}-${value}-${index}`}
// 												initial={{ scaleX: 0, opacity: 0 }}
// 												animate={{ scaleX: 1, opacity: 1 }}
// 												exit={{ scaleX: 0, opacity: 0 }}
// 												transition={{
// 													type: "spring",
// 													stiffness: 400,
// 													damping: 25,
// 												}}
// 												style={{
// 													originX: 0,
// 													backgroundColor:
// 														valueToShow === 0
// 															? isDarkMode
// 																? "var(--accent)"
// 																: `var(--muted)`
// 															: getColorForBox
// 															? getColorForBox(valueToShow)
// 															: isDarkMode
// 															? "var(--primary)"
// 															: "var(--primary-4)",
// 												}}
// 												className="flex-1 text-foreground min-w-16 h-8 rounded-md text-center flex items-center justify-center overflow-hidden"
// 											>
// 												{valueToShow}
// 											</motion.div>
// 										);
// 									})}
// 								</AnimatePresence>
// 							</div>
// 						</div>
// 					);
// 				})}
// 				<div className="flex flex-row gap-2 w-full mb-4">
// 					<div className="min-w-32"></div>
// 					<div className="flex flex-row gap-2 flex-1">
// 						{xAxisValues.map((value) => (
// 							<div
// 								key={value}
// 								className="flex-1 w-full min-w-16 text-xs text-muted-foreground text-center"
// 							>
// 								{value}
// 							</div>
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
