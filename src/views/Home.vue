<template>
  <v-card>
   <v-list dense>
      <v-list-item-group v-model="item" color="primary">
        <v-list-item
          v-for="item in items"
          :key="item.id"
          :to="{path:'/artist/'+item.id}" 
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  data: () => ({
    items: [
      { id: 1, text: 'Foo'},
      { id: 2, text: 'Bar'},
      { id: 3, text: 'Baz'},
    ]
  })
}
</script>
