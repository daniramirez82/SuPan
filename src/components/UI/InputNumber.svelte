<script>
    export let smallColumns = "s12";
    export let value;
    export let id;
    export let classInput;
    export let classLabel;
    export let label;
    export let min;
    export let max;
  </script>
  
  <div class="input-field col {smallColumns}">
    <input type="number" bind:value class={classInput} {id} {min} {max} on:input />
    <label for={id} class={classLabel}>
      {label}
    </label>
  </div>
  