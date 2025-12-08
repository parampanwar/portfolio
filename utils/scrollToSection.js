export const scrollToSection = (id) => {
  const targetId = id.startsWith('/') ? id.replace('/', '') : id;
  const section = document.querySelector(targetId);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};
