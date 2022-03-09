const modalElement = document.querySelector(".modal-overlay");

const Modal = {
  open(event) {
    event.preventDefault();
    modalElement.classList.add("active");
  },
  close(event) {
    event.preventDefault();
    modalElement.classList.remove("active");
  },
};

modalElement.addEventListener("click", (event) => {
  if (event.target == modalElement) {
    Modal.close();
  }
});
