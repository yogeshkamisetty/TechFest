document.addEventListener("DOMContentLoaded", function () {
    var revealItems = document.querySelectorAll(".fade-up");
    if ("IntersectionObserver" in window && revealItems.length > 0) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = "running";
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealItems.forEach(function (item) {
            item.style.animationPlayState = "paused";
            observer.observe(item);
        });
    }

    var signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            var password = document.getElementById("password").value;
            var confirmPassword = document.getElementById("confirmPassword").value;
            if (password.length < 8) {
                event.preventDefault();
                alert("Password must be at least 8 characters.");
                return;
            }
            if (password !== confirmPassword) {
                event.preventDefault();
                alert("Passwords do not match.");
            }
        });
    }
});
