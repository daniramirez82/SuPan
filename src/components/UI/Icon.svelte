<script>
    import { createEventDispatcher } from "svelte";
    export let eventName=null;
    export let id='button';
    export let disabled = false;
    export let iconName=null;
  
    const dispacher = createEventDispatcher();
  </script>
  
  <span
    id={id}
    on:click={()=> dispacher(eventName)}
    disabled = {disabled}><i class="material-icons"> {iconName}</i></span
  >
  