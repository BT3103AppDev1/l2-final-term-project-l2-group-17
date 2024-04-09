<template>
  <div>
    <select class="form-select" v-model="selectedMajor">
      <option disabled value="">Select your major</option>
      <optgroup v-for="faculty in faculties" :key="faculty.name" :label="faculty.name">
        <option v-for="department in faculty.departments" :key="department" :value="department">
          {{ department }}
        </option>
      </optgroup>
    </select>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: "MajorSelectDropdown",
  setup() {
    const faculties = ref([]);

    const selectedMajor = ref("");

    onMounted(async () => {
      try {
        const response = await fetch('https://api.nusmods.com/v2/2023-2024/moduleInfo.json');
        if (!response.ok) throw new Error('Failed to fetch modules');
        const modules = await response.json();

        const facultyDepartmentMap = new Map();

        for (const module of modules) {
          if (!facultyDepartmentMap.has(module.faculty)) {
            facultyDepartmentMap.set(module.faculty, new Set([module.department]));
          } else {
            facultyDepartmentMap.get(module.faculty).add(module.department);
          }
        }

        const facultyData = [];
        facultyDepartmentMap.forEach((departments, faculty) => {
          facultyData.push({
            name: faculty,
            departments: [...departments].sort(),
          });
        });

        faculties.value = facultyData.sort((a, b) => a.name.localeCompare(b.name));

      } catch (error) {
        console.error(error);
      }
    });

    return {
      faculties,
      selectedMajor,
    };
  },
};
</script>
