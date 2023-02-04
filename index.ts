type PetHousing = {
	initialCost: number,
	requiredSpace: number,
	dailyFee: number;
};

type InvestmentOption = {
	numCages: number
	numRuns: number
};

type Bookings = InvestmentOption; 

type BusinessConstraints = {
	availableSpace: number; // 360
	budget: number; // 1280
}

type Outcome = {
	option: InvestmentOption;
	finalBalance: number;
}

const businessContraints:BusinessConstraints = {
	availableSpace: 360,
	budget: 1280
};

const catCage:PetHousing = {
	initialCost: 32,
	requiredSpace: 6,
	dailyFee: 8
}

const dogRun:PetHousing = {
	initialCost: 80,
	requiredSpace: 24,
	dailyFee: 20
}

function calcInvestmentOptions(constraints: BusinessConstraints, catCage: PetHousing, dogRun: PetHousing): InvestmentOption[] {
	const options:InvestmentOption[] = [];

	const maxCatCages = Math.min(constraints.availableSpace / catCage.requiredSpace,
		constraints.budget / catCage.initialCost);

	const maxDogRuns = Math.min(constraints.availableSpace / dogRun.requiredSpace,
		constraints.budget / dogRun.initialCost);

	for (let catIndex=0; catIndex <= maxCatCages; catIndex++) {
		for (let dogIndex=0; dogIndex <= maxDogRuns; dogIndex++) {
			const currOption = {numCages: catIndex, numRuns: dogIndex};
			if (withinBudgets(catIndex, dogIndex) && uniqueOption(options, currOption)) {
				options.push(currOption);
			}
		}
	}

	function withinBudgets(numCatCages:number, numDogRuns:number):boolean {
		return ((numCatCages * catCage.initialCost) + (numDogRuns * dogRun.initialCost) <= constraints.budget) &&
		((numCatCages * catCage.requiredSpace) + (numDogRuns * dogRun.requiredSpace) <= constraints.availableSpace);
	}

	function uniqueOption(currentOptions: InvestmentOption[], toCheck:InvestmentOption): boolean {
		return !currentOptions.find(({numCages, numRuns}) => toCheck.numCages === numCages && toCheck.numRuns === numRuns);
	}

	return options;
}

function calcBalance(startingBalance: number, bookings: Bookings, catCage: PetHousing, dogRun: PetHousing, numDays: number): number {
	const dailyCatRevenue = bookings.numCages * catCage.dailyFee;
	const dailyDogRevenue = bookings.numRuns * dogRun.dailyFee;
	return startingBalance + ((dailyCatRevenue + dailyDogRevenue) * numDays);
}

function calcBalanceFromInitial(initialBalance: number, bookings: Bookings, catCage: PetHousing, dogRun: PetHousing, numDays: number): number {
	const investment = (bookings.numCages * catCage.initialCost) + (bookings.numRuns * dogRun.initialCost);
	const dailyCatRevenue = bookings.numCages * catCage.dailyFee;
	const dailyDogRevenue = bookings.numRuns * dogRun.dailyFee;
	return initialBalance - investment + ((dailyCatRevenue + dailyDogRevenue) * numDays);
}

function getOutcome(initialBudget:number, option:InvestmentOption, numDays:number): Outcome {
	return {
		option,
		finalBalance: calcBalanceFromInitial(initialBudget, option, catCage, dogRun, numDays)
	};
};

function getOutcomes(initialBudget:number, options:InvestmentOption[], numDays:number): Outcome[] {
	return options.map<Outcome>(option => getOutcome(initialBudget, option, numDays));
};

const options = calcInvestmentOptions(businessContraints, catCage, dogRun);

console.log('Total Options Considered:', options.length);

for (let dayIndex=1; dayIndex <= 30; dayIndex++) {
	const dailyOutcomes = getOutcomes(businessContraints.budget, options, dayIndex);
	// Sort by finalBalance; desc
	dailyOutcomes.sort((a, b) => b.finalBalance - a.finalBalance);
	console.log(`Day ${dayIndex}:`);
	dailyOutcomes.slice(0, 3).forEach(outcome => printOutcome(outcome));
	console.log('\n\n');
}


// Sort by finalBalance; desc
// outcomes.sort((a, b) => b.finalBalance - a.finalBalance);

// console.log('All Outcomes:');
// console.log(outcomes.map(outcome => `Cat Cages: ${outcome.option.numCages}, Dog Runs: ${outcome.option.numRuns}, Balance: ${outcome.finalBalance}`).join('\n'));

// console.log('Top 10 Outcomes:');
// console.log(outcomes.slice(0, 9).map(outcome => `Cat Cages: ${outcome.option.numCages}, Dog Runs: ${outcome.option.numRuns}, Balance: ${outcome.finalBalance}`).join('\n'));


function printOutcome(outcome: Outcome) {
	console.log(`Cat Cages: ${outcome.option.numCages}, Dog Runs: ${outcome.option.numRuns}, Balance: ${outcome.finalBalance}`);
}


// Algorithm:
// Calculate initial purchase options
// calculate monthly returns for each option
// sort by best options
