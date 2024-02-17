var companyNameInput = document.getElementById("companyName");
const checkButton = document.getElementById("checkButton");
const resultParagraph = document.getElementById("result");

checkButton.addEventListener("click", async () => {
  const companyName = companyNameInput.value.toLowerCase().trim();

  if (companyName === '') {
    document.body.style.backgroundColor = "white";
    resultParagraph.textContent = "Search for a company";
    return;
  }

  const mlmList = await fetch('companies/mlms.txt').then(response => response.text());
  const legitList = await fetch('companies/legitCompanies.txt').then(response => response.text());

  const mlmStrings = mlmList.split('\n').map(str => str.trim()).filter(Boolean);
  const legitStrings = legitList.split('\n').map(str => str.trim()).filter(Boolean);

  const getMatchPercentage = (str1, str2) => {
    const commonChars = str1.split('').filter(char => str2.includes(char));
    return (commonChars.length / str1.length) * 100;
  };

  let matchPercentage = 0;
  let closestMatch = '';

  for (const str of mlmStrings) {
    const currentPercentage = getMatchPercentage(companyName, str);
    if (currentPercentage === 100) {
      document.body.style.backgroundColor = "red";
      resultParagraph.textContent = "Yes, this is an MLM.";
      return;
    } else if (currentPercentage > matchPercentage) {
      matchPercentage = currentPercentage;
      closestMatch = str;
    }
  }

  if (matchPercentage >= 100) {
    document.body.style.backgroundColor = "green";
    resultParagraph.textContent = "This is NOT an MLM. This is a fortune-500 company.";
  } else if (matchPercentage >= 50) {
    document.body.style.backgroundColor = "yellow";
    resultParagraph.textContent = "Maybe. It sounds like an MLM.";
  } else {
    const isFortune500 = legitStrings.some(legitCompany => companyName.includes(legitCompany.toLowerCase()));
    if (isFortune500) {
      document.body.style.backgroundColor = "green";
      resultParagraph.textContent = "This is NOT an MLM. This is a fortune-500 company.";
    } else {
      document.body.style.backgroundColor = "green";
      resultParagraph.textContent = "This is NOT an MLM.";
    }
  }
});
