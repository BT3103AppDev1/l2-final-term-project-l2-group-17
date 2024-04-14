<template>
    <div id="vueCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button
          v-for="(image, index) in images"
          :key="index"
          type="button"
          :data-bs-target="'#vueCarousel'"
          :data-bs-slide-to="index"
          :class="{ active: index === 0 }"
          :aria-label="'Slide ' + (index + 1)"
        ></button>
      </div>
      <div class="carousel-inner">
  <div v-for="(image, index) in images" :key="image.id" class="carousel-item" :class="{ active: index === 0 }">
    <div class="caption-container">
      <h1>{{ image.title }}</h1>
      <p>{{ image.description }}</p>
    </div>
    <img :src="image.src" class="d-block w-100" :alt="image.alt">
  </div>
</div>



      <button class="carousel-control-prev" type="button" data-bs-target="#vueCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#vueCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Carousel',
    data() {
      return {
        images: [
          { id: 1, src: '../assets/calculator.svg', alt: 'First slide', title: 'GPA Calculator', description: 'GPA calculation made easy.' },
          { id: 2, src: '../assets/planner.svg', alt: 'Second slide', title: 'Module Planner', description: 'Personalized by you, for you.' },
          { id: 3, src: '../assets/community.svg', alt: 'Third slide', title: 'Forum', description: 'Sharing is caring.' },
        ]
      }
    }
  }
  </script>


<style scoped>
.caption-container {
  text-align: center;
  color: black;
}

.carousel-item {
  position: relative;
  height: 95vh
}

.carousel-item img {
  display: block;
  width: 100%;
  height: 100%;
}




</style>







