//force byvar as parameters
class Population {
    private populationPool:Array<Array<number>>;
    private fitnessValues:number[];
    constructor(public chromosomeSize: number, public minVal:number, public maxVal:number, public isInteger:boolean, populationSize:number) {
        this.populationPool = Population.generateChromosomes(chromosomeSize, minVal, maxVal, isInteger, populationSize);
    }

    public static generateChromosomes(chromosomeSize:number, minVal:number, maxVal:number, isInteger:boolean, numChromosmoes:number) : number[][]{
        let chromosomes: number[][] = [];
        for(let i=0; i<numChromosmoes; i++) {
            let c:number[] = [];
            for(let j=0; j<chromosomeSize; j++) {
                let t:number = Math.random() * (maxVal - minVal);
                if(isInteger) {
                    t = Math.round(t);
                }
                c.push(t);
            }
        }
        return chromosomes;
    }

    public assignFitnessValues(fitnessValues:Array<number>) {
        if(fitnessValues.length != this.populationPool.length) {
            throw new Error("fitness value array length should equal population pool size length");
        }
        this.fitnessValues = fitnessValues;
    }

    public mutate(fn:(arg0:number[])=>[]) {
        for(let i=0; i<this.populationPool.length; i++) {
            this.populationPool[i] = fn(this.populationPool[i]);
        }
    }

    public selectParentForNextGeneration(fn:(arg0:number[][])=>number[][], numParentsToSelect:number) {
        this.populationPool = fn(this.populationPool);
    }

    public static rouletteWheelSelection(population:number[][], fitnessValues:number[], numParentsToSelect:number) : number[][] {
        let s = fitnessValues.reduce((s, c)=>s+c);
        let parents = [];
        for(let p=0; p<numParentsToSelect; p++) {
            let point:number = s * Math.random();
            let i = 0;
            while(s>0) {
                point-= fitnessValues[i];
                i++;
            }
            parents.push(population[i]);
        }
        return parents;
    }

    public static tournamentSelection(population:number[][], k:number, numParentsToSelect:number, fitnessValues:number[]) : number[][] {
        let parentsSelected = [];
        for(let i=0; i<numParentsToSelect; i++) {
            let competitors:[number, number][] = []
            for(let j=0; j<k; j++) {
                let r = Math.random();
                competitors.push([r * population.length, fitnessValues[r]]);
            }
            parentsSelected.push(competitors.reduce((a, b) => a[1] > b[1] ? a : b)[0]);
        }
        return parentsSelected;
    }

    public static rankSelection(population:number[][], numParentsToSelect:number) : number[][] {
        let parentsSelected = [];
        for(let i=0; i<numParentsToSelect; i++) {
            parentsSelected.push(population[Math.random() * population.length]);
        }
        return parentsSelected; 
    }

    public crossOver(fn:(arg0:number[][]) => number[][], selectionFn:(arg0:number[][])=>number[][]) {
        
    }

    public static onePointCrossOver(index:number, chromsome1:number[], chromosome2:number[]) {
        return chromsome1.slice(0, index).concat(chromosome2.slice(index));
    }

    public static multiPointCrosOver(indexes:number[], chromosome1:number[], chromosome2:number[]) {
        let t = 0;
        for(let i=0; i<indexes.length; i++) {
            while(i<indexes[t]) {

            }
        }
    }

    public static UniformCrossOver(chromosome1:number[], chromosom2:number[]) {
        let c:number[] = [];
        for(let i=0; i<chromosome1.length; i++) {
            c.push(Math.random() > 0.5 ? chromosome1[i] : chromosom2[i]);
        }
    }

    public static swapMutation(chromosome:number[], numSwaps:number) {
        for(let i=0; i<numSwaps; i++) {
            let a = Math.random() * chromosome.length, b = Math.random() * chromosome.length;
            let t:number = chromosome[a];
            chromosome[a] = chromosome[b];
            chromosome[b] = chromosome[a];
        }
        return chromosome;
    }

    public static scrambleMutation(chromosome:number[], startingIndex:number, endingIndex:number) {
        let portion:number[] = chromosome.slice(startingIndex, endingIndex);
        for (let i = portion.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [portion[i], portion[j]] = [portion[j], portion[i]];
        }
        for(let i =0; i<portion.length; i++) {
            chromosome[i + startingIndex] = portion[i];
        }
        return portion;
    }

    public static inversionMutation(chromosome:number[], startingIndex:number, endingIndex:number) {
        let portion:number[] = chromosome.slice(startingIndex, endingIndex);
        for(let i =0; i<portion.length; i++) {
            chromosome[endingIndex - i] = portion[i];
        }
        return portion;
    }

}