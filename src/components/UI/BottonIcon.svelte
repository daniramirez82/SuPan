<script>
  import { createEventDispatcher } from "svelte";
  export let eventName=null;
  export let id='button';
  export let disabled = false;
  export let iconName=null;

  const dispacher = createEventDispatcher();
</script>

<button
  id={id}
  class="waves-effect waves-light btn"
  on:click={()=> dispacher(eventName)}
  disabled = {disabled}><i class="material-icons"> {iconName}</i></button
>
