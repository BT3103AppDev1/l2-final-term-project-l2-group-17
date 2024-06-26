<template>
  <div>
    <ModulePlanningHeader />
    <span class="title">Current Degree Programme: {{ primaryDegree }}</span>
    <div class="page-container">
      <div class="accordion-container">
        <!-- University Level Requirements Accordion -->
        <button class="accordion" @click="toggleAccordionULR">
          University Level Requirements
          <span class="arrow">{{ isAccordionULROpen ? "▲" : "▼" }}</span>
          <span
            :class="{
              'badge badge-success': mcCount['ulr'] >= this.mcLimit.ulr, // if all req met then success (green)
              'badge badge-danger': mcCount['ulr'] < this.mcLimit.ulr, // else danger (red)
            }"
            >{{ mcCount["ulr"] }}/{{ this.mcLimit.ulr}} MCs</span
          >
        </button>
        <div v-show="isAccordionULROpen" class="accordion-content">
          <div v-for="(category, index) in ulrModules" :key="index">
            <span class="subtitle">{{ category.label }}</span>
            <span
              :class="{
                'badge badge-success': category.moduleCount > 0,
                'badge badge-danger': category.moduleCount === 0,
              }"
              >{{
                category.moduleCount > 0 ? "Fulfilled" : "Not Fulfilled"
              }}</span
            >
            <ModuleNonSearchBox
              v-if="category.module"
              :key="index"
              :category="index"
              :module="category.module"
            />
            <button class="add-module-btn" @click="showULRDialog[index] = true">
              Select A Module
            </button>
            <ModuleDialog
              v-if="showULRDialog[index]"
              @close="showULRDialog[index] = false"
              :allModules="allFilteredModules"
              @module-selected="
                (module) => handleULRModuleSelected(module, index)
              "
              :prefix="ulrModulePrefixes[index]"
            />
          </div>
        </div>

        <!-- Core Modules Accordion -->
        <button class="accordion" @click="toggleAccordionCS">
          Core Modules
          <span class="arrow">{{ isAccordionCSOpen ? "▲" : "▼" }}</span>
          <span
            :class="{
              'badge badge-success': mcCount['cm'] >= this.mcLimit.cm, // if all req met then success (green)
              'badge badge-danger': mcCount['cm'] < this.mcLimit.cm, // else danger (red)
            }"
            >{{ mcCount["cm"] }}/{{ totalCoreModuleCredits }} MCs</span
          >
        </button>
        <div v-show="isAccordionCSOpen" class="accordion-content">
          <ModuleNonSearchBox
            v-for="code in coreModules"
            :key="code"
            :category="cmCategory"
            :module="findModule(code)"
          />
        </div>

        <!-- Programme Electives Accordion !-->
        <button class="accordion" @click="toggleAccordionPE">
          Programme Electives
          <span class="arrow">{{ isAccordionPEOpen ? "▲" : "▼" }}</span>
          <span
            :class="{
              'badge badge-success': mcCount['pe'] >= this.mcLimit.pe, // if all req met then success (green)
              'badge badge-danger': mcCount['pe'] < this.mcLimit.pe, // else danger (red)
            }"
            >{{ mcCount["pe"] }}/{{ this.mcLimit.pe }} MCs</span
          >
        </button>
        <div v-show="isAccordionPEOpen" class="accordion-content">
          <ModuleNonSearchBox
            v-for="module in peModules"
            :key="module.moduleCode"
            :category="peCategory"
            :module="module"
          />
          <button class="add-module-btn" @click="showPEDialog = true">
            <span class="plus-symbol">+</span> Add Module
          </button>
          <ModuleDialog
            v-if="showPEDialog"
            @close="showPEDialog = false"
            :allModules="allFilteredModules"
            @module-selected="handlePEModuleSelected"
            :prefix=null
          />
        </div>

        <!-- Unrestricted Electives Accordion !-->
        <button class="accordion" @click="toggleAccordionUE">
          Unrestricted Electives
          <span class="arrow">{{ isAccordionUEOpen ? "▲" : "▼" }}</span>
          <span
            :class="{
              'badge badge-success': mcCount['ue'] >= this.mcLimit.ue, // if all req met then success (green)
              'badge badge-danger': mcCount['ue'] < this.mcLimit.ue, // else danger (red)
            }"
            >{{ mcCount["ue"] }}/{{ this.mcLimit.ue }} MCs</span
          >
        </button>
        <div v-show="isAccordionUEOpen" class="accordion-content">
          <ModuleNonSearchBox
            v-for="module in ueModules"
            :key="module.moduleCode"
            :category="ueCategory"
            :module="module"
          />
          <button class="add-module-btn" @click="showUEDialog = true">
            <span class="plus-symbol">+</span> Add Module
          </button>
          <ModuleDialog
            v-if="showUEDialog"
            @close="showUEDialog = false"
            :allModules="allFilteredModules"
            @module-selected="handleUEModuleSelected"
            :prefix=null
          />
        </div>
      </div>

      <!--Study Plan Component !-->
      <div class="study-plan-container" ref="studyPlanAll">
        <button class="btn btn-primary" @click="saveStudyPlansToFirestore">Save Study Plans
        </button>
        <!-- Loop through 4 years -->
        <div v-for="year in 4" :key="year" class="year-row">
          <!-- Loop through 2 semesters per year -->
          <div v-for="semester in 2" :key="semester" class="semester-column">
            <div
              class="study-plan"
              :ref="'studyPlan' + ((year - 1) * 2 + semester)"
              @drop.prevent="
                (event) => dropModule(event, (year - 1) * 2 + semester - 1)
              "
              @dragover.prevent="allowDrop"
            >
              <span class="title">{{
                getSemester((year - 1) * 2 + semester - 1)
              }}</span>
              <div class="drop-zone">Drop modules here</div>
              <div
                v-for="(module, moduleIndex) in studyPlans[
                  (year - 1) * 2 + semester - 1
                ]"
                :key="moduleIndex"
                class="dropped-module"
              >
                {{ module.moduleCode }} {{ module.title }}
                <button
                  @click="removeModule(module, (year - 1) * 2 + semester - 1)"
                  class="remove-module-btn"
                >
                  &#x2715;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModuleSearchBox from "./ModuleSearchBox.vue";
import ModuleNonSearchBox from "./ModuleNonSearchBox.vue";
import ModuleDialog from "./ModuleDialog.vue";
import ModulePlanningHeader from "./ModulePlanningHeader.vue";
import { btCoreModules } from "./constants";
import { csCoreModules } from "./constants";
import { isCoreModules } from "./constants";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc,setDoc } from "firebase/firestore";


export default {
  name: "ModuleBox",
  components: {
    ModuleDialog,
    ModuleSearchBox,
    ModuleNonSearchBox,
    ModulePlanningHeader,
  },
  data() {
    return {
      userId: null,
      studyPlans: Array(8)
        .fill()
        .map(() => []), // create 8 separate study plans as empty arrays
      moduleSearch: "",
      selectedModule: null, // Holds the currently selected module object
      filteredModules: [],
      mcCount : { ulr: 0, cm: 0, pe: 0, ue: 0 },


      // supposed to fetch user major from user database
      coreModules: [],
      cmCategory: "cm",
      coreModulesCopy: [],

      // information for ULR modules
      showULRDialog: Array(6).fill(false), // for toggling the state of the search boxes
      ulrModules: [
        { label: "Critique & Expression", module: null, moduleCount: 0 },
        { label: "Communities & Engagement", module: null, moduleCount: 0 },
        { label: "Cultures & Connections", module: null, moduleCount: 0 },
        { label: "Singapore Studies", module: null, moduleCount: 0 },
        { label: "Data Literacy", module: null, moduleCount: 0 },
        { label: "Digital Literacy", module: null, moduleCount: 0 },
      ],
      ulrModulePrefixes: [
        ["GEX"],
        ["GEN"],
        ["GEC"],
        ["GESS"],
        ["GEA1000", "BT1101", "ST1131", "DSA1101"],
        ["CS1101S", "CS1010A", "CS1010J"],
      ],

      // prefixes and other information for PE category
      showPEDialog: false,
      peModulePrefixes: ["BT3", "BT4", "IS3", "IS4"],
      peLabel: "Programme Electives",
      peCategory: "pe",
      peModules: [],

      // prefixes and other information for PE category
      showUEDialog: false,
      ueModulePrefixes: ["JS", "A", "C"],
      UELabel: "Unrestricted Electives",
      ueCategory: "ue",
      ueModules: [],

      // toggle accordions open/closed states
      isAccordionULROpen: false,
      isAccordionCSOpen: false,
      isAccordionPEOpen: false,
      isAccordionUEOpen: false,
      allModules: [],
      primaryDegree: "",
    };
  },
  async created() {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        await Promise.all([
          this.fetchStudyPlansFromFirestore(),
          this.loadUserData(),
          this.fetchModules() 
        ]);
        this.getCoreModules(); 
        this.updateMCCounts(); 
      } catch (error) {
        console.error("Error in data fetching:", error);
      }
    }
    this.userFound = !!user;
  });
},

  methods: {
    calculateTotalCredits() {
    let totalCredits = 0; 
    this.coreModulesCopy.forEach(moduleCode => {
      const module = this.formattedModules.find(m => m.moduleCode === moduleCode);
      if (module && module.credits) {
        const credits = parseInt(module.credits, 10);
        if (!isNaN(credits)) {
          totalCredits += credits;
        } else {
          console.error("Invalid credit value for module:", moduleCode, module.credits);
        }
      } else {
        console.error("Module not found or has no credit defined:", moduleCode);
      }
    });
    return totalCredits;
  },
    handleModuleCreditChange(moduleCode, isAdding, category) {
    const module = this.formattedModules.find(m => m.moduleCode === moduleCode);
    console.log(module);
    if (module && module.credits) {
      const credits = parseInt(module.credits, 10); 
      if (!isNaN(credits)) {
        if (isAdding) {
          this.mcCount[category] += credits;
        } else {
          this.mcCount[category] -= credits;
        }
      } else {
        console.error("Invalid credit value for module:", moduleCode, module.credits);
      }
    } else {
      console.error("Module not found or has no credit defined:", moduleCode);
    }
  },
  async fetchStudyPlansFromFirestore() {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  if (!user) {
    console.log("No user logged in.");
    return;
  }

  const studyPlanDocRef = doc(db, 'studyPlans', user.uid);
  try {
    const docSnap = await getDoc(studyPlanDocRef);
    if (docSnap.exists()) {
      this.studyPlans = this.parseStudyPlansFromFirestore(docSnap.data());
    } else {
      console.log("No study plan found.");
    }
  } catch (error) {
    console.error("Error fetching study plans:", error);
  }
},

parseStudyPlansFromFirestore(data) {
  const parsedData = [];
  Object.keys(data).sort().forEach(key => {
    if (key.startsWith('semester_')) {
      // Assume data[key] is an array of modules
      parsedData.push(data[key].map(module => {
        return {
          ...module,
          category: module.category, // Ensure category is part of your module data
          credits: module.credits
        };
      }));
    }
  });
  return parsedData;
},
    formatStudyPlansForFirestore() {
    const formatted = {};
    this.studyPlans.forEach((semester, index) => {
      formatted[`semester_${index + 1}`] = semester.map(module => {
        return { moduleCode: module.moduleCode, title: module.title, category: module.category};
      });
    });
    console.log(formatted);
    return formatted;
  },

  async saveStudyPlansToFirestore() {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in to save your study plans.");
    return;
  }

  const formattedStudyPlans = this.formatStudyPlansForFirestore(); 
  const studyPlanDocRef = doc(db, 'studyPlans', user.uid);

  try {
    await setDoc(studyPlanDocRef, formattedStudyPlans, { merge: true });
    alert('Study plans saved successfully!');
  } catch (error) {
    console.error('Error saving study plans:', error);
    alert('Failed to save study plans.');
  }
  console.log(this.formattedModules)
},
updateMCCounts() {
  this.mcCount = { ulr: 0, cm: 0, pe: 0, ue: 0 };
  this.studyPlans.forEach(semester => {
    semester.forEach(module => {
      const moduleInfo = this.formattedModules.find(m => m.moduleCode === module.moduleCode);
      if (!moduleInfo) {
        console.error("Module not found in formattedModules:", module.moduleCode);
        return; 
      }

      const credits = parseInt(moduleInfo.credits, 10);
      if (isNaN(credits)) {
        console.error("Invalid credit value for module:", module.moduleCode, moduleInfo.credits);
        return; 
      }
      if (Number.isInteger(module.category) && module.category < this.ulrModules.length) {
        this.ulrModules[module.category].moduleCount += credits; 
        this.mcCount['ulr'] += credits; 
      } 
      else if (module.category && this.mcCount.hasOwnProperty(module.category)) {
        this.mcCount[module.category] += credits;
      }
    });
  });

  console.log("Updated MC counts:", this.mcCount);
},



    getSemester(index) {
      const year = Math.floor(index / 2) + 1;
      const semester = index % 2 === 0 ? 1 : 2;
      return "Y" + year + "S" + semester;
    },

    handlePEModuleSelected(module) {
      if (!this.peModules.some((m) => m.moduleCode === module.moduleCode)) {
        this.peModules.push(module);
      }
    },

    handleUEModuleSelected(module) {
      if (!this.ueModules.some((m) => m.moduleCode === module.moduleCode)) {
        this.ueModules.push(module);
      }
    },

    handleULRModuleSelected(module, index) {
      this.ulrModules[index].module = module;
    },

    toggleAccordionULR() {
      this.isAccordionULROpen = !this.isAccordionULROpen;
    },
    toggleAccordionCS() {
      this.isAccordionCSOpen = !this.isAccordionCSOpen;
    },
    toggleAccordionPE() {
      this.isAccordionPEOpen = !this.isAccordionPEOpen;
    },
    toggleAccordionUE() {
      this.isAccordionUEOpen = !this.isAccordionUEOpen;
    },

    removeModule(module, semesterIndex) {
      // updated to filter the modules from the correct semester list
      this.studyPlans[semesterIndex] = this.studyPlans[semesterIndex].filter(
        (m) => m.moduleCode !== module.moduleCode
      );

      if (module.category === "cm") {
        this.coreModules.push(module.moduleCode); // return the moduleCode to the list of coreModules
        this.handleModuleCreditChange(module.moduleCode, false, module.category)
      }

      if (module.category === "pe") {
        this.peModules.push(module); // return the module to the list of peModules
        this.handleModuleCreditChange(module.moduleCode, false, module.category);
      }

      if (module.category === "ue") {
        this.ueModules.push(module); // return the module to the list of ueModules
        this.handleModuleCreditChange(module.moduleCode, false, module.category);
      }

      if (Number.isInteger(module.category)) {
        this.ulrModules[module.category].module = module; // return the module to the list of ulrModules under the correct category
        this.ulrModules[module.category].moduleCount -= 1; // requirement is not fulfilled
        this.handleModuleCreditChange(module.moduleCode, false, "ulr");
      }
    },

    allowDrop(event) {
      event.preventDefault();
    },

    dropModule(event, semesterIndex) {
      const moduleData = event.dataTransfer.getData("application/json");
      const module = JSON.parse(moduleData);

      // add to the study plan if it is not already inside (prevents duplicates)
      if (
        !this.studyPlans[semesterIndex].some(
          (m) => m.moduleCode === module.moduleCode
        )
      ) {
        this.studyPlans[semesterIndex].push(module);
      }

      // removing from their categories
      if (module.category === "cm") {
        this.coreModules = this.coreModules.filter(
          (m) => m !== module.moduleCode
        );
        this.handleModuleCreditChange(module.moduleCode, true, module.category);
      }

      // removing from their categories
      if (module.category === "pe") {
        this.peModules = this.peModules.filter(
          (m) => m.moduleCode !== module.moduleCode
        );
        this.handleModuleCreditChange(module.moduleCode, true, module.category);
      }

      if (module.category === "ue") {
        this.ueModules = this.ueModules.filter(
          (m) => m.moduleCode !== module.moduleCode
        );
        this.handleModuleCreditChange(module.moduleCode, true, module.category);
      }

      if (Number.isInteger(module.category)) {
        this.ulrModules[module.category].module = null; // remove the module
        this.ulrModules[module.category].moduleCount += 1; // requirement is fulfilled
        this.handleModuleCreditChange(module.moduleCode, true, "ulr");
      }
    },

    findModule(code) {
      const module = this.allFilteredModules.find(
        (module) => module.moduleCode === code
      );
      return module || null;
    },

    async fetchModules() {
      try {
        const response = await fetch(
          "https://api.nusmods.com/v2/2023-2024/moduleInfo.json"
        );
        this.allModules = await response.json();
      } catch (error) {
        console.error("Failed to fetch modules:", error);
      }
    },

    async loadUserData() {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.primaryDegree = userData.primaryDegree;
        }
      }
    },

    async getCoreModules() {
      switch (this.primaryDegree) {
        case "Business Analytics":
          this.coreModules = btCoreModules;
          break;
        case "Computer Science":
          this.coreModules = csCoreModules;
          break;
        case "Information Systems":
          this.coreModules = isCoreModules;
          break;
        default:
          this.coreModules = [];
          break;
      }
      this.coreModulesCopy = [...this.coreModules];
    },
  },
  computed: {
    mcLimit() {
    return {
      ulr: 24,
      cm: this.totalCoreModuleCredits, // dynamically calculated from another computed property
      pe: 160 - 24 - this.totalCoreModuleCredits - 40, // uses the computed cm total
      ue: 40
    };
  },
    formattedModules() {
      return this.allModules.map(module => ({
        label: module.moduleCode,
        moduleCode: module.moduleCode,
        credits: module.moduleCredit,
        su: module.attributes && module.attributes.su ? true : false
      }));
    },
    totalCoreModuleCredits() {
    return this.calculateTotalCredits();
  },
  allFilteredModules() {
    // Flatten the array of arrays in studyPlans to get a single list of modules
    const plannedModules = this.studyPlans.flat().map(module => module.moduleCode);

    // Filter allModules to exclude those that are already in plannedModules
    return this.allModules.filter(module => !plannedModules.includes(module.moduleCode));
  }
  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  gap: 20px;
}

.accordion {
  background-color: lightblue;
  color: #000;
  cursor: pointer;
  padding: 18px;
  width: 400px;
  text-align: left;
  border: none;
  outline: none;
  font-size: 15px;
  transition: 0.4s;
  border-radius: 4px;
  margin-bottom: 10px;
}

.badge-success {
  margin-left: 10px;
  background-color: green;
}

.badge-danger {
  background-color: red;
  margin-left: 10px;
}

.accordion-content {
  padding: 0 18px;
  background: #fff;
  overflow: wrap;
  width: 350px;
  transition: max-height 0.2s ease-out;
}

.accordion-container {
  width: 50%; /* Right side takes up the other half */
  justify-content: center;
  align-items: center;
}

.study-plan-container {
  width: 50%; /* left side takes up the other half */
  min-height: 100vh; /* Ensures it's at least as tall as the viewport */
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  overflow: visible; /* Ensures no clipping of content */
}

.year-row {
  display: flex;
  width: 100%;
  justify-content: space-between; /* Spreads the semester columns evenly */
  margin-bottom: 20px;
}

.semester-column {
  flex: 1; /* Each semester column takes up half the space */
  padding: 10px;
}

/* design for each semester */
.study-plan {
  margin-top: 20px;
  margin-bottom: 20px; /* Adds space between semesters */
  width: 100%;
  height: 100%;
  border: 2px dashed #ccc;
  border-radius: 4px;
  text-align: center;
  padding: 20px;
  background-color: #e0e0e0;
  border-style: dashed;
  overflow: hidden; /* Optional, adjust based on content visibility */
}

.drop-zone {
  transition: background-color 0.2s ease-in-out;
}

.drop-zone.drag-over {
  background-color: #f0f0f0;
}

.dropped-module {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dropped-module .remove-module-btn {
  margin-left: 10px;
  border: none;
  background: none;
  cursor: pointer;
  color: #333;
  font-size: 1.5rem;
}

.arrow {
  float: right;
}

.add-module-btn {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: 350px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-top: 10px;
  margin-bottom: 20px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.plus-symbol {
  font-size: 20px;
  margin-right: 5px;
}

.add-module-btn:hover {
  background-color: #f0f0f0;
}

.subtitle {
  font-weight: bold;
}

.title {
  font-weight: bold;
  font-size: 30px;
  margin: 30px;
}
</style>
