type Employee = {
	id: string | number;
	name: string;
	availability: {
		mon: { day: boolean; night: boolean };
		tue: { day: boolean; night: boolean };
		wed: { day: boolean; night: boolean };
		thurs: { day: boolean; night: boolean };
		fri: { day: boolean; night: boolean };
		sat: { day: boolean; night: boolean };
		sun: { day: boolean; night: boolean };
	};
	allocation: { day: number; night: number };
};

const daysOfWeek = ["mon", "tue", "wed", "thurs", "fri", "sat", "sun"];
const shifts: ("day" | "night")[] = ["day", "night"];

interface IRule {
	checkRule(
		employee: Employee,
		currentShift: "day" | "night",
		schedule?: any,
		currentDayIndex?: number
	): boolean;
}

class ConsecutiveShiftsRule implements IRule {
	checkRule(
		employee: Employee,
		currentShift: "day" | "night",
		schedule: any,
		currentDayIndex: number
	) {
		if (currentShift === "day") {
			if (!currentDayIndex) {
				if (schedule[daysOfWeek[currentDayIndex]].night === employee.id)
					return false;
				return true;
			}

			if (
				schedule[daysOfWeek[currentDayIndex - 1]].night === employee.id ||
				schedule[daysOfWeek[currentDayIndex]].night === employee.id
			)
				return false;
			return true;
		}

		if (currentDayIndex === 6) {
			if (schedule[daysOfWeek[currentDayIndex]].day === employee.id)
				return false;
			return true;
		}

		if (
			schedule[daysOfWeek[currentDayIndex]].day === employee.id ||
			schedule[daysOfWeek[currentDayIndex + 1]].day === employee.id
		)
			return false;
		return true;
	}
}

class EmployeeAllocationsAvailabilityRule implements IRule {
	checkRule(employee: Employee, currentShift: "day" | "night") {
		// console.log({
		// 	employee: employee.id,
		// 	currentShift,
		// 	allocations: employee.allocation[currentShift],
		// });
		if (employee.allocation[currentShift] <= 0) return false;
		return true;
	}
}

class EmployeeShiftAvailabilityRule implements IRule {
	checkRule(
		employee: Employee,
		currentShift: "day" | "night",
		schedule?: any,
		currentDayIndex?: number
	): boolean {
		// console.log({
		// 	employee: employee.id,
		// 	currentShift,
		// 	day: daysOfWeek[currentDayIndex!],
		// 	available:
		// 		employee.availability[daysOfWeek[currentDayIndex!]][currentShift],
		// });
		return employee.availability[daysOfWeek[currentDayIndex!]][currentShift];
	}
}

const employees: Employee[] = [
	{
		id: "abeeha",
		name: "Abeeha",
		availability: {
			mon: {
				day: true,
				night: true,
			},
			tue: {
				day: true,
				night: true,
			},
			wed: {
				day: true,
				night: true,
			},
			thurs: {
				day: true,
				night: true,
			},
			fri: {
				day: false,
				night: false,
			},
			sat: {
				day: false,
				night: false,
			},
			sun: {
				day: false,
				night: false,
			},
		},
		allocation: {
			day: 2,
			night: 1,
		},
	},
	{
		id: "umaid",
		name: "Umaid",
		availability: {
			mon: {
				day: true,
				night: true,
			},
			tue: {
				day: true,
				night: false,
			},
			wed: {
				day: false,
				night: false,
			},
			thurs: {
				day: true,
				night: true,
			},
			fri: {
				day: false,
				night: true,
			},
			sat: {
				day: true,
				night: true,
			},
			sun: {
				day: true,
				night: true,
			},
		},
		allocation: {
			day: 1,
			night: 3,
		},
	},
	{
		id: "huzaifa",
		name: "Huzaifa",
		availability: {
			mon: {
				day: true,
				night: true,
			},
			tue: {
				day: true,
				night: true,
			},
			wed: {
				day: true,
				night: true,
			},
			thurs: {
				day: true,
				night: true,
			},
			fri: {
				day: true,
				night: true,
			},
			sat: {
				day: true,
				night: true,
			},
			sun: {
				day: true,
				night: true,
			},
		},
		allocation: {
			day: 2,
			night: 2,
		},
	},
	{
		id: "laiba",
		name: "Laiba",
		availability: {
			mon: {
				day: false,
				night: false,
			},
			tue: {
				day: false,
				night: true,
			},
			wed: {
				day: true,
				night: true,
			},
			thurs: {
				day: true,
				night: false,
			},
			fri: {
				day: false,
				night: true,
			},
			sat: {
				day: true,
				night: true,
			},
			sun: {
				day: true,
				night: false,
			},
		},
		allocation: {
			day: 2,
			night: 1,
		},
	},
];

const rules: IRule[] = [
	new ConsecutiveShiftsRule(),
	new EmployeeAllocationsAvailabilityRule(),
	new EmployeeShiftAvailabilityRule(),
];

function calculate_schedule(employees: Employee[], rules: IRule[]) {
	var schedule = {
		mon: { day: null, night: null },
		tue: { day: null, night: null },
		wed: { day: null, night: null },
		thurs: { day: null, night: null },
		fri: { day: null, night: null },
		sat: { day: null, night: null },
		sun: { day: null, night: null },
	};

	// check for any shifts where there is only one employee option
	for (var i = 0; i < 7; i++) {
		let dayAvailable: Employee[] = [];
		let nightAvailable: Employee[] = [];

		employees.forEach((employee) => {
			if (Object.values(employee.availability)[i].day) {
				dayAvailable.push(employee);
			}
			if (Object.values(employee.availability)[i].night) {
				nightAvailable.push(employee);
			}
		});

		if (dayAvailable.length == 1) {
			schedule[daysOfWeek[i]].day = dayAvailable[0].id;
			dayAvailable[0].allocation.day -= 1;
		}
		if (nightAvailable.length == 1) {
			schedule[daysOfWeek[i]].night = nightAvailable[0].id;
			nightAvailable[0].allocation.night -= 1;
		}
	}

	// check the rules for all employees
	for (var i = 0; i < 7; i++) {
		let dayAvailable: Employee[] = [];
		let nightAvailable: Employee[] = [];
		const dayOfTheWeek: string = daysOfWeek[i];

		employees.forEach((employee) => {
			var passedAllRules = false;
			for (let shift of shifts) {
				for (let rule of rules) {
					var allow = rule.checkRule(employee, shift, schedule, i);
					if (!allow) {
						passedAllRules = false;
						break;
					}
					passedAllRules = true;
				}
				if (passedAllRules && shift === "day") {
					dayAvailable.push(employee);
				}
				if (passedAllRules && shift === "night") {
					nightAvailable.push(employee);
				}
			}
		});

		if (!schedule[dayOfTheWeek].day) {
			var found = false;
			for (let emp of dayAvailable) {
				for (var rule of rules) {
					var allow = rule.checkRule(emp, "day", schedule, i);
					if (!allow) {
						found = false;
						break;
					}
					found = true;
				}
				if (found) {
					schedule[dayOfTheWeek].day = emp.id;
					emp.allocation.day -= 1;
					break;
				}
			}
		}

		if (!schedule[dayOfTheWeek].night) {
			var found = false;
			for (let emp of nightAvailable) {
				for (var rule of rules) {
					var allow = rule.checkRule(emp, "night", schedule, i);
					if (!allow) {
						found = false;
						break;
					}
					found = true;
				}
				if (found) {
					schedule[dayOfTheWeek].night = emp.id;
					emp.allocation.night -= 1;
					break;
				}
			}
		}

		console.log({
			day: dayOfTheWeek,
			dayAvailable: dayAvailable.map((e) => e.id),
			nightAvailable: nightAvailable.map((e) => e.id),
			// schedule,
		});
	}

	return schedule;
}

var weekly_schedule = calculate_schedule(employees, rules);

console.log(weekly_schedule);
