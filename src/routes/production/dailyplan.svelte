<script context="module">
  let date = new Date().toLocaleDateString("en-GB");
  date = date.replace(/\//g, "").toString();
  import { firestore } from "../../firebase";
  export async function preload(page, session) {
    let db = await firestore();
    let productsList = await db.collection("productos").orderBy("nombre").get();
    let planOfTheDay = await db.collection("dailyPlans").doc(date).get();
    return {
      infoFromDB: {
        productsList: productsList,
        planOfTheDay: planOfTheDay,
      },
    };
  }
</script>

<script>
  import { onMount, onDestroy } from "svelte";
  import products from "../../Stores/products.js";
  import dailyPlanStore from "../../Stores/dailyPlan";
  import InputNumber from "../../components/UI/InputNumber.svelte";
  import ModalCalculateQuantity from "../../../src/components/UI/ModalCalculateQuantity.svelte";
  import ButtonSmall from "../../components/UI/ButtonSmall.svelte";
  import BottonLarge from "../../components/UI/BottonLarge.svelte";
  import DailyPlanList from "../../components/lists/DailyPlanList.svelte";
  import { Product } from "../../Helpers/blueprints";

  export let infoFromDB;
  let selected;
  let quantityInputValue = "";
  let modalCalculateQuantityDOM = false;
  const date = new Date().toLocaleDateString("en-GB");
  let dateInput = "";
  let bottomAddValidation = true;
  let dailyPlan = [];

  $: console.log("cada cambio en dailyplan", dailyPlan);

  products.setProducts(infoFromDB.productsList);

  function quantityCalculated(e) {
    quantityInputValue = e.detail;
    modalCalculateQuantityDOM = false;
  }

  function addToPlan(id, quantityInputValue) {
    let already = false;
    $dailyPlanStore.forEach((prod) => {
      if (prod.product.id === id) {
        already = true;
      }
    });

    if (already) {
      resetForm();
      return;
    } else {
      const tempArray = $products.filter((prod) => prod.id === id);
      const _product = tempArray[0];
      const temProduct = new Product(
        _product.id,
        _product.nombre,
        _product.peso,
        _product.presentacion,
        _product.recipe
      );
      const dailyRecipe = temProduct.genRecipe(parseFloat(quantityInputValue));

      let newProductToPlan = {
        dailyQuantity: quantityInputValue,
        product: _product,
        dailyRecipe,
      };
      dailyPlan = [...dailyPlan, newProductToPlan];
      sendDailyPlan(dailyPlan);
    }
    resetForm();
  }

  function validationAdd() {
    if (selected !== "" && quantityInputValue > 0) {
      bottomAddValidation = false;
    } else bottomAddValidation = true;
  }

  function resetForm() {
    selected = "";
    quantityInputValue = "";
    bottomAddValidation = true;
  }

  function deleteItemDailyPlan(e) {
    const product = e.detail;
    let tempArray = dailyPlan.filter((item) => item.product.id != product.id);
    dailyPlan = tempArray;
    sendDailyPlan(tempArray);
  }

  function sendDailyPlan(dailyPlan) {
    const dailyPlanToStore = {
      day: dateInput.value,
      plan: dailyPlan,
    };
    dailyPlanStore.addNewDP(dailyPlanToStore);
  }

  async function searchDailyPlanDB(date) {
    dailyPlan = await dailyPlanStore.searchDailyPlanDB(date);
    console.log(dailyPlan);
  }

  async function changeCheckbox(e) {
    const checkboxStatus = e.detail.checkboxStatus;
    const ingredientName = e.detail.ingredientName;
    const productId = e.detail.productId;
    console.log(e.detail);
    const date = dateInput.value;
    //In order to replace de value of the ingredient checkbox on the daily plan;
    //each ingredient object on the daily plan has a "done" key which is as the same time
    //the value of the "checked" prop of the checbox, so:
    //first: look for the product in the dailyPlan array
    const idxProduct = dailyPlan.findIndex(
      (item) => item.product.id === productId
    );
    const idxIngredient = dailyPlan[idxProduct].dailyRecipe.findIndex(
      (item) => item.ingredientName === ingredientName
    );
    //replace the value of the "done" key in the object
    dailyPlan[idxProduct].dailyRecipe[idxIngredient].done = checkboxStatus;
    console.log(dailyPlan[idxProduct].dailyRecipe[idxIngredient]);
  }

  onMount(() => {
    var instances = M.Datepicker.init(dateInput, {
      format: "dd/mm/yyyy",
      autoClose: true,
      setDefaultDate: true,
      onSelect: (date) => {
        searchDailyPlanDB(date);
      },
    });
    dateInput.value = date;

    dailyPlan = dailyPlanStore.setDailyPlan(infoFromDB.planOfTheDay);
  });

  onDestroy(() => {
    
      sendDailyPlan(dailyPlan);
    
  });
</script>

<div class="day-title">
  <h6 class="title">Plan Diario, dia:</h6>
  <div class="day-title-input">
    <label for="date">Dia:</label>
    <input
      type="text"
      id="date"
      bind:this={dateInput}
      on:input={searchDailyPlanDB(dateInput.value)}
    />
  </div>
</div>
<div class="product">
  Producto:

  <select
    class="browser-default selectInput"
    bind:value={selected}
    on:input={validationAdd}
  >
    <option value="" disabled selected>Seleccione Producto</option>
    {#each $products as product}
      <option value={product.id}>{product.nombre}</option>
    {/each}
  </select>
</div>
<div class="quantity">
  <span>Cantidad: </span>
  <div class="quantity-input-number">
    <InputNumber
      id="quantity"
      label="Cantidad"
      bind:value={quantityInputValue}
      min="1"
      on:input={validationAdd}
    />
  </div>
  <ButtonSmall on:click={() => (modalCalculateQuantityDOM = true)}
    >Calcular</ButtonSmall
  >
</div>
<div class="addButton">
  <BottonLarge
    on:click={() => addToPlan(selected, quantityInputValue)}
    disabled={bottomAddValidation}>Agregar</BottonLarge
  >
</div>
<DailyPlanList
  on:deleteFromList={deleteItemDailyPlan}
  {dailyPlan}
  on:changeCheckbox={changeCheckbox}
/>

{#if modalCalculateQuantityDOM}
  <ModalCalculateQuantity
    on:cancel={() => (modalCalculateQuantityDOM = false)}
    on:calculated={quantityCalculated}
  />
{/if}

<style>
  .day-title {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    border-bottom: 1px solid rgba(160, 160, 160, 0.2);
  }

  .day-title-input {
    max-width: 90px;
  }

  .title {
    margin-right: 20px;
  }

  .product {
    margin-top: 20px;
  }

  .quantity {
    display: flex;
    max-width: 450px;
    justify-content: flex-start;
    align-items: center;
  }

  .quantity-input-number {
    max-width: 90px;
    margin-left: 10px;
    margin-right: 20px;
  }

  .addButton {
    border-bottom: 1px solid rgba(160, 160, 160, 0.2);
    padding-bottom: 10px;
  }
</style>
