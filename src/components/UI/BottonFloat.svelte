<script>
    export let href= null;
    export let type;
</script>


<a on:click
  class="btn-floating btn-large halfway-fab waves-effect waves-light amber"
  {href}>
  <i class="material-icons">{type}</i>
</a>
<style>
.btn-floating{
    margin-top: -55px;
    position: relative;
}
</style>
