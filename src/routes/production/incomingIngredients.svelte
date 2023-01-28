<script>
  import { onMount } from "svelte";
  import InputText from "../../components/UI/InputText.svelte";
  import ButtonSmall from "../../components/UI/ButtonSmall.svelte";
  import { notes, notesStore } from "../../Stores/notes";
  import { ingredientsStore } from "../../Stores/ingredients";
  import FormIncomingIngredients from "../../components/UI/FormIncomingIngredients.svelte";
  import Table from "../../components/UI/Table.svelte";

  let date = new Date().toLocaleDateString("en-GB");
  let options;
  let noteId;
  let supplier;
  let actualDate;
  let infoValidated = false;
  let noteArray = [];

  $: console.log(noteArray);

  function autoGenNoteId() {
    const _noteId = Date.now();
    noteId = _noteId;
  }
  //call a list of ingredient from store to the input list of ingredients
  async function getIngredients() {
    options = await ingredientsStore.setIngredientsFromClient();
  }

  function addIngredient(e) {
    const data = e.detail;
    console.log(data);

    //check if the ingredient already exist in the array with lodash method
    let already = _.find(noteArray, { ingredient: data.ingredient });
    //if exist return and do not add
    if (already) return;

    // if do not exist add to the array the new ingredient to show in the DOM
    noteArray = [...noteArray, data];

    validateForm();
  }

  function validateForm() {
    if (
      noteId !== "" &&
      supplier !== "" &&
      actualDate.value !== "" &&
      noteArray[0] !== 0
    ) {
      infoValidated = true;
    } else infoValidated = false;
  }

  function saveNote(noteArray) {
    const note = {
      noteId,
      supplier,
      date: actualDate.value,
      content: noteArray,
    };
    notesStore.addNewNote(note);
  }

  function deleteRow(e) {
    const ingredientName = e.detail.ingredient;
    const newArrayTemp = _.filter(noteArray, (item) => {
      return item.ingredient !== ingredientName;
    });
    console.log(newArrayTemp);
    noteArray = newArrayTemp;
  }

  onMount(() => {
    var instance2 = M.Datepicker.init(actualDate, {
      format: "dd/mm/yyyy",
      autoClose: true,
      setDefaultDate: true,
    });

    actualDate.value = date;

    getIngredients();
  });
</script>

<div>
  <div class="supplier-info container brown  lighten-5">
    <div class="row">
      <div class="col s4 proveedor">
        <span>Proveedor: </span>
      </div>
      <div class="col s8">
        <InputText
          on:input={validateForm}
          bind:value={supplier}
          id="supplier"
          label="Nom. Empresa"
        />
      </div>
    </div>
    <!-- //end the row -->

    <div class="row">

      <div class="col s4 proveedor">
        <span>Nº Doc: </span>
      </div>

      <div class="supplier-info-note-id col s8">
        <InputText
          on:input={validateForm}
          bind:value={noteId}
          id="note-id"
          label="Albarán Nº"
        />

        <div class="small-button">
          <div class="small-button-flex">
            <ButtonSmall disabled={false} on:click={autoGenNoteId}
            >Auto</ButtonSmall
          >
          </div>
          
        </div>

      </div>

    </div>
    <!-- end of the row -->

    <div class="row row-fecha">
      <div class="col s4 proveedor">
        <span>Fecha: </span>
      </div>

      <div class="actual-date col s6">
        <label for="actual-date">Fecha Entrada</label>
        <input
          type="text"
          id="actual-date"
          bind:this={actualDate}
          on:input={validateForm}
        />
      </div>
    </div>
  </div>

  <svg
    class="separator"
    width="351"
    height="8"
    viewBox="0 0 351 8"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line y1="2" x2="351" y2="2" stroke="black" />
  </svg>

  
  <FormIncomingIngredients {options} on:ingredientToAdd={addIngredient} />

  <!-- we use an if cuz we can not send a undefined as an array to the table -->
  {#if noteArray.length > 0}
    <Table tableData={noteArray} on:deleteIngredient={deleteRow} />
  {/if}
  <ButtonSmall
    href="/production"
    on:click={saveNote(noteArray)}
    disabled={!infoValidated}>Guardar Albarán</ButtonSmall
  >
</div>

<style>
  .separator {
    margin-top: 25px;
  }

  .supplier-info {
    margin-top: 25px;
    padding: 8px;
    border-radius: 4px;
  }

  .proveedor {
    color: #9e9e9e;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
  }

  .row {
    height: 45px;
  }

  .row-fecha {
    height: 65px;
  }

  .supplier-info-note-id {
    position: relative;
    height: 100%;
  }

  .small-button{
    position: absolute;
    right: 0;
    height: 100%;
  }
  .small-button-flex{
    height: 100%;
    display: flex;
    align-items: center;
  }
</style>
