const modalElement = document.querySelector(".modal-overlay");

const Modal = {
  open() {
    event.preventDefault();
    modalElement.classList.add("active");
  },
  close() {
    event.preventDefault();
    modalElement.classList.remove("active");
  },
};

modalElement.addEventListener("click", (event) => {
  if (event.target == modalElement) {
    Modal.close();
  }
});
