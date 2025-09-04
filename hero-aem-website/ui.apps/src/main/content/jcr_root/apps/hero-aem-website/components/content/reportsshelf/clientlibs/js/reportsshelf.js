$(document).ready(function () {
    $(".annual-report-container .report-footer").click(async function (e) {
        const pdfUrls = $(this).parent().find("a[href$='.pdf']").map(function () {
            return $(this).attr("href");
        }).get();
        let zip = new JSZip();
        let count = 0;
        let zipFilename = $('.annual-report-container .annual-report-header').text().toLowerCase().replace(/\s/g, '') + ".zip";
        if (pdfUrls.length > 0) {
            pdfUrls.forEach(function (url) {
                JSZipUtils.getBinaryContent(url, function (err, data) {
                    if (err) {
                        throw err; // or handle the error
                    }
                    zip.file(url.replace(/.*\//g, ""), data, {
                        binary: true,
                        createFolders: true
                    });
                    count++;
                    if (count == pdfUrls.length) {
                        zip.generateAsync({
                            type: "blob"
                        })
                        .then(function (blob) {
                            saveAs(blob, zipFilename);
                        });
                    }
                });
            });
        }
    });
})