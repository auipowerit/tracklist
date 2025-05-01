export function checkEmptyForm(formRef) {
  let isEmpty = false;

  Array.from(formRef.current.elements).forEach((e) => {
    if (
      (e.nodeName === "INPUT" || e.nodeName === "TEXTAREA") &&
      e.value.trim() === ""
    ) {
      e.classList.add("invalid-field");
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
