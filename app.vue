<script setup lang="ts">
import {useFetch} from "nuxt/app";

const data = await useFetch("/api/games");


</script>



<template>
  <div>
    {{data }}
  </div>
</template>
