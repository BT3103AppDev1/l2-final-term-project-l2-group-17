<template>
  <!-- split into two left and right columns for the headers !-->
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <!-- content for the left column (required modules)-->
        <div class="left-aligned-column">
          <div class="title">Required Modules</div>

          <!-- list of degree requirements and their respective modules !-->
          <div class="accordion" id="degree-requirements">
            <div
              v-for="requirement in requirements"
              :key="index"
              class="accordion-item"
            >
              <h2 class="accordion-header" :id="'heading' + index">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                  @click="toggleAccordion(index)"
                >
                  {{ requirement }}
                </button>
              </h2>
              <!-- click to toggle the dropdown feature, references array below -->
              <!-- currently not working for some reason :((( !-->
              <div
                :id="'collapse' + index"
                class="accordion-collapse collapse"
                :class="{ show: isOpen[index] }"
              >
                <div class="accordion-body">
                  <!-- modules that fall under this category will be included under the heading !-->
                  <div
                    @drop="onDrop($event, requirement)"
                    @dragenter.prevent
                    @dragover.prevent
                  >
                    <div
                      v-for="item in getList(requirement)"
                      :key="item.id"
                      class="module"
                      draggable="true"
                      @dragstart="startDrag($event, item)"
                    >
                      <span> {{ item.title }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- content for the right column (study plan) !-->
      <div class="col-md-6">
        <!-- list of modules taken for each semester !-->
        <div class="left-aligned-column">
          <!-- header with study plan and plan validation button !-->
          <div class="row align-items-center">
            <div class="col-auto">
              <div class="title">Study Plan</div>
            </div>
            <div class="col">
              <button class="btn btn-secondary">Validate Study Plan</button>
            </div>
          </div>

          <!-- module allocation by semester !-->
          <div class="scrollable-box">
            <!-- with hidden overflow, scroll to see bottom if content too long !-->
            <div class="row">
              <div class="col-md-6">
                <div class="subheading">Year 1 Semester 1</div>
                <div
                  class="semester-box"
                  @drop="onDrop($event, 11)"
                  @dragenter.prevent
                  @dragover.prevent
                >
                  <div
                    v-for="item in getList(11)"
                    :key="item.id"
                    class="module"
                    draggable="true"
                    @dragstart="startDrag($event, item)"
                  >
                    <span> {{ item.title }}</span>
                    <span class="remove-icon" @click="removeModule(item)"
                      >❌</span
                    >
                  </div>
                </div>
              </div>

              <!-- right inner column is for year 1 semester 2 !-->
              <!-- code will be neater if we do tabs instead, but idk how the drag n drop might work in that case !-->
              <div class="col-md-6">
                <div class="subheading">Year 1 Semester 2</div>
                <div
                  class="semester-box"
                  @drop="onDrop($event, 12)"
                  @dragenter.prevent
                  @dragover.prevent
                >
                  <div
                    v-for="item in getList(12)"
                    :key="item.id"
                    class="module"
                    draggable="true"
                    @dragstart="startDrag($event, item)"
                  >
                    <span> {{ item.title }}</span>
                    <span class="remove-icon" @click="removeModule(item)"
                      >❌</span
                    >
                    <!-- remember to include an MC indicator !-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  data() {
    return {
      // list of degree requirements for students
      requirements: [
        "Common Curriculum Requirements",
        "Unrestricted Electives",
        "Programme Requirements",
        "Programme Electives",
      ],

      isOpen: Array.from({ length: 4 }).fill(false), // keeps track of which accordion (degree requirement) is open or closed
    };
  },

  methods: {
    toggleAccordion(index) {
      this.isOpen[index] = !this.isOpen[index]; // toggle the accordion open and closed
    },
  },

  setup() {
    // separate list of modules grouped based on their requirement category
    const items = ref([
      { id: 0, title: "Module A", req: "CC", MCs: 4 },
      { id: 1, title: "Module B", req: "UE", MCs: 4 },
      { id: 2, title: "Module C", req: "CC", MCs: 4 },
      { id: 3, title: "Module D", req: "PR", MCs: 4 },
      // for the last one im just testing if the getList() is working properly
      { id: 4, title: "Module E", req: "Y1S1", MCs: 4 },
    ]);

    const getList = (req) => {
      if (req === "Common Curriculum Requirements") {
        return items.value.filter((item) => item.req === "CC");
      } else if (req === "Unrestricted Electives") {
        return items.value.filter((item) => item.req === "UE");
      } else if (req === "Programme Requirements") {
        return items.value.filter((item) => item.req === "PR");
      } else if (req === "Programme Electives") {
        return items.value.filter((item) => item.req === "PE");
      } else if (req === 11) {
        // omg help idk how else to do this ik it looks abit dumb
        return items.value.filter((item) => item.req === "Y1S1");
      } else if (req === 12) {
        return items.value.filter((item) => item.req === "Y1S2");
      } else if (req === 21) {
        return items.value.filter((item) => item.req === "Y2S1");
      }
    };

    const startDrag = (event, item) => {
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("itemID", item.id);
    };

    const onDrop = (event, req) => {
      const itemID = event.dataTransfer.getData("itemID");
      const item = items.value.find((item) => item.id === parseInt(itemID));
      if (item.req !== req) {
        item.req = req;
      }
    };

    const removeModule = (item) => {
      item.list = 1; // move the item back to the first list
    };

    return {
      getList,
      onDrop,
      startDrag,
      removeModule,
    };
  },
};
</script>

<style>
.container {
  padding: 10px;
}

.semester-box {
  margin: 0 10px;
  padding: 80px;
}

.title {
  text-align: left;
  font-weight: bold;
  font-size: 30px;
  padding-top: 20px;
  padding-bottom: 10px;
}

.subheading {
  text-align: left;
  font-weight: bold;
  font-size: 20px;
}

.req-modules {
  display: flex;
}

.module {
  position: relative;
  display: inline-block;
  background-color: #89cff0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 30px 40px;
  margin-top: 10px;
  margin-bottom: 20px;
  margin-right: 20px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  top: 5px;
}

.module:hover {
  background-color: #72a0c1;
}

.module:hover .remove-icon {
  display: inline;
}

.module:last-child {
  margin-bottom: 0;
}

.remove-icon {
  font-size: 20px;
  color: #ff0000;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}

.left-aligned-column {
  text-align: left;
  padding-right: 20px;
}

.scrollable-box {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}

.scrollable-box::-webkit-scrollbar {
  width: 8px;
}

.scrollable-box::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}
</style>
