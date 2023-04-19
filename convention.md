this.$refs.brandSelectBoxRef.instance.open();
this.gridDataSource.reload(); // gọi lại hàm load

let windowWidthMediaQuery = window.matchMedia("(min-width: 992px)");
this.setGalleryWidth(windowWidthMediaQuery); // Call listener function at run time
windowWidthMediaQuery.addListener(this.setGalleryWidth); // Attach listener function on state changes
setGalleryWidth(x) {
if (x.matches) {
// If media query matches
this.galleryWidth = undefined;
} else {
this.galleryWidth = "100vw";
}
}

// format date:
format: "dd/MM/yyyy HH:mm"

// format currency:
format: { style: "currency", currency: "vnd" },
