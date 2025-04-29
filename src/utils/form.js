export function checkEmptyForm(formRef) {
  let isEmpty = false;

  Array.from(formRef.current.elements).forEach((element) => {
    if (
      (element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") &&
      element.value.trim() === ""
    ) {
      element.classList.add("invalid-field");
      isEmpty = true;
    }
  });

  return isEmpty;
}

export function isEmailValid(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export function isPasswordValid(password) {
  return password.length >= 8;
}
