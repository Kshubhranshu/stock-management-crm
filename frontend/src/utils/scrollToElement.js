export const scrollToElement = (
    elementId,
    options = { behavior: "smooth", block: "start" }
) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView(options);
    }
};
