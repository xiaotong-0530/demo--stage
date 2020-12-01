<template>
  <div>
    我是Home~~~~
    <Hello/>
  </div>
</template>

<script>
// @ is an alias to /src
import Hello from "@c/HelloWorld"
export default {
  name: "Home",
  components: {
      Hello
  }
};
</script>
