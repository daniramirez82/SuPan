<script>
  export let smallColumns = "s12";
  export let value;
  export let id;
  export let classInput;
  export let classLabel;
  export let label;
  export let placeholder="";
  export let disabled = false;
</script>

<div class="input-field col {smallColumns}">
  <input type="text" bind:value class={classInput} {id} {placeholder} on:input {disabled}/>
  <label for={id} class={classLabel}>
    {label}
  </label>
</div>

<style>
  .input-field {
    margin: 0;
  }
</style>