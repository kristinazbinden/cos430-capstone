import { medication } from "./classes.js";

const ClinicalTablesAPI = {
  baseUrl: "https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search",

  async searchmedications(query) {
    const url = `${this.baseUrl}?terms=${encodeURIComponent(query)}&ef=STRENGTHS_AND_FORMS`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`HTTP error: ${response.status}`);
        return null;
      }

      const data = await response.json();
      const names = data[3] ?? [];
      const strengthsAndForms = data[2]?.STRENGTHS_AND_FORMS ?? [];

      const medications = [];

      for (let i = 0; i < names.length; i++) {
        const name = names[i][0];
        const strengths = strengthsAndForms[i] ?? [];

        if (strengths.length > 0) {
          for (const dose of strengths) {
            medications.push(new medication(name, dose));
          }
        } else {
          medications.push(new medication(name, "N/A"));
        }
      }

      return medications;
    } catch (error) {
      console.error("Error fetching medication data:", error.message);
      return null;
    }
  },
};

export default ClinicalTablesAPI;


async function main() {
  const query = "advil";
  const meds = await ClinicalTablesAPI.searchmedications(query);

  if (!meds) {
    console.error("No medications returned.");
    return;
  }

  console.log(`Found ${meds.length} medication entries:\n`);
  meds.forEach((med, i) => {
    console.log(`${i + 1}. ${med.medicationName} - ${med.dose} (rating: ${med.rating})`);
  });
}

main();



  