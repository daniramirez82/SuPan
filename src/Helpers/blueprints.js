export class Product {
  constructor(id, nombre, peso, presentacion, recipe) {
    this.id = id;
    this.nombre = nombre;
    this.peso = peso;
    this.presentacion = presentacion;
    this.recipe = recipe;
  }

  genRecipe = function (quantityToProduce) {
    let recipeWeights = [];
    let nonFloursWeights = 0;

    this.recipe.forEach((ing) => {
      if (!ing.isAFlour) {
        nonFloursWeights += parseFloat(ing.ingredientQuantity);
      }
    });

    const floursWeight = 100 / (100 + nonFloursWeights);

    const totalFlourPlan =
      (floursWeight * parseFloat(this.peso) * parseFloat(quantityToProduce)) /
      1000;

    const nonFloursQ = (tFP) => {
      this.recipe.forEach((ing) => {
        if (!ing.isAFlour) {
          let ingWeight = ing.ingredientQuantity * tFP * 10; //the result is in grams
          recipeWeights = [
            ...recipeWeights,
            {
              ingredientName: ing.ingredientName,
              ingredientWeight: ingWeight.toFixed(2),
              done: false, 
              measure: 'gm'
            },
          ];
        }
      });
    };

    nonFloursQ(totalFlourPlan);

    const floursQ = (tFP) => {
      this.recipe.forEach((ing) => {
        if (ing.isAFlour) {
          let flourWeight = (ing.ingredientQuantity * tFP) / 100; //the result is in kilograms
          recipeWeights = [
            ...recipeWeights,
            {
              ingredientName: ing.ingredientName,
              ingredientWeight: flourWeight.toFixed(2),
              done: false,
              measure: 'kg'
            },
          ];
        }
      });
    };

    floursQ(totalFlourPlan);

    return recipeWeights;
  };
}
