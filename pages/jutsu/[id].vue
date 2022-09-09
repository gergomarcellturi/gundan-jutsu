<script setup>
  import {Jutsu} from "../../components/model/Jutsu";
  import {jutsuList} from "../../components/model/constants/JutsuList";

  const route = useRoute()
  console.log(route.params);
  const jutsu = new Jutsu();
  jutsu.chakra = 300
  console.log(jutsuList);


</script>


<template>
  <div>
    this is paramed: {{$route.params.group}} - {{ $route.params.id }}
    {{jutsu.chakra}}
<!--    <JutsuTemplate :jutsu="jutsu"></JutsuTemplate>-->
  </div>
</template>
