(function () {
    "use strict";

    var profileKey = "alfajjarTeamProfile";
    var sessionKey = "alfajjarTeamSession";
    var fallbackCode = "123456";
    window.AlfajjarDemoTeams = window.AlfajjarDemoTeams || [
        { id: "demo-strikers", teamName: "Al Fajjar Strikers", captainName: "Ahmed Khan", category: "Cricket", city: "Lahore", area: "Model Town", memberCount: 18, address: "Model Town, Lahore", notes: "A competitive cricket side welcoming friendly fixtures and tournament invitations.", image: "images/member/team1.jpg" },
        { id: "demo-united", teamName: "Northside United", captainName: "Bilal Ahmed", category: "Football", city: "Lahore", area: "Gulberg", memberCount: 22, address: "Gulberg, Lahore", notes: "Community football team playing weekly league and friendly matches.", image: "images/member/team2.jpg" },
        { id: "demo-court", teamName: "Court Vision", captainName: "Sara Malik", category: "Basketball", city: "Islamabad", area: "F-7", memberCount: 12, address: "F-7, Islamabad", notes: "Basketball team open to mixed scrimmages and weekend tournaments.", image: "images/member/team3.jpg" },
        { id: "demo-spikers", teamName: "The Spikers", captainName: "Hassan Raza", category: "Volleyball", city: "Karachi", area: "Clifton", memberCount: 14, address: "Clifton, Karachi", notes: "Volleyball club looking to connect with other local teams.", image: "images/member/team4.jpg" },
        { id: "demo-athletics", teamName: "All Court Collective", captainName: "Mariam Noor", category: "Multi Sport", city: "Lahore", area: "DHA", memberCount: 16, address: "DHA, Lahore", notes: "A multi-sport group organizing regular games across the city.", image: "images/member/team1.jpg" }
    ];

    function qs(selector, scope) {
        return (scope || document).querySelector(selector);
    }

    function qsa(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    function getProfile() {
        var raw = localStorage.getItem(profileKey);
        if (!raw) {
            return {
                teamName: "Al Fajjar Strikers",
                captainName: "Team Captain",
                email: "team@example.com",
                phone: "",
                category: "Cricket",
                address: "",
                city: "",
                area: "",
                notes: "",
                image: "",
                members: [
                    { id: 1, name: "Ahmed Khan", role: "Captain", phone: "", status: "Active" },
                    { id: 2, name: "Usman Ali", role: "All Rounder", phone: "", status: "Active" }
                ]
            };
        }

        try {
            return JSON.parse(raw);
        } catch (error) {
            localStorage.removeItem(profileKey);
            return getProfile();
        }
    }

    function saveProfile(profile) {
        var teams = [];
        try {
            teams = JSON.parse(localStorage.getItem("alfajjarTeamDirectory") || "[]");
        } catch (error) {
            teams = [];
        }
        var teamId = profile.directoryId || "team-" + String(profile.email || Date.now()).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
        profile.directoryId = teamId;
        localStorage.setItem(profileKey, JSON.stringify(profile));
        var directoryTeam = {
            id: teamId,
            teamName: profile.teamName || "Unnamed team",
            captainName: profile.captainName || "",
            email: profile.email || "",
            phone: profile.phone || "",
            category: profile.category || "Other",
            address: profile.address || "",
            city: profile.city || "",
            area: profile.area || "",
            notes: profile.notes || "",
            image: profile.image || "",
            memberCount: (profile.members || []).length,
            updatedAt: new Date().toISOString()
        };
        var existingIndex = teams.findIndex(function (team) { return team.id === teamId; });
        if (existingIndex === -1) teams.push(directoryTeam);
        else teams[existingIndex] = directoryTeam;
        localStorage.setItem("alfajjarTeamDirectory", JSON.stringify(teams));
    }

    function injectStyles() {
        if (qs("#alfajjar-auth-styles")) return;

        var style = document.createElement("style");
        style.id = "alfajjar-auth-styles";
        style.textContent = [
            ".auth-modal .modal-dialog{max-width:720px}",
            ".auth-modal .modal-content{border-radius:10px;padding:34px;background:#fff}",
            ".auth-modal h2{font-size:34px;line-height:42px;margin-bottom:18px;text-transform:uppercase}",
            ".auth-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}",
            ".auth-modal label,.profile-field label{font-family:'Oswald',sans-serif;text-transform:uppercase;font-size:13px;letter-spacing:.06em;margin-bottom:8px;color:#121212}",
            ".auth-modal input,.auth-modal select,.profile-field input,.profile-field select,.profile-field textarea{width:100%;height:52px;border:1px solid #d7d7d7;border-radius:6px;padding:0 14px;font-size:16px;background:#fff;color:#121212}",
            ".profile-field textarea{height:112px;padding-top:12px;resize:vertical}",
            ".team-logo-control{display:flex;align-items:center;gap:14px;min-height:52px}",
            ".team-logo-control input[type=file]{height:auto;padding:12px;background:#fff}",
            ".team-logo-preview{display:grid;width:58px;height:58px;flex:0 0 58px;place-items:center;overflow:hidden;border:1px solid #dfe5d8;border-radius:50%;background:#e5edcf;color:#364824;font-family:Oswald,sans-serif;font-size:24px;text-transform:uppercase}",
            ".team-logo-preview.has-image{background-position:center;background-size:cover;color:transparent}",
            ".auth-help{margin-top:16px;font-size:16px;line-height:24px}",
            ".auth-message{display:none;margin:0 0 16px;padding:12px 14px;border-radius:6px;background:#eef8c9;color:#121212}",
            ".auth-message.show{display:block}",
            ".auth-code-step{display:none}",
            ".auth-code-step.show{display:block}",
            ".profile-shell{padding:80px 0;background:#f6f6f6}",
            ".profile-layout{display:grid;grid-template-columns:280px minmax(0,1fr);gap:28px;align-items:start}",
            ".profile-sidebar,.profile-panel{background:#fff;border-radius:10px;padding:24px;border:1px solid #e7e7e7}",
            ".profile-sidebar h2,.profile-panel h2{font-size:30px;line-height:38px;margin-bottom:18px;text-transform:uppercase}",
            ".profile-tabs{display:flex;flex-direction:column;gap:10px}",
            ".profile-tab{width:100%;border:1px solid #d8d8d8;background:#fff;border-radius:6px;padding:13px 14px;text-align:left;font-family:'Oswald',sans-serif;text-transform:uppercase;color:#121212}",
            ".profile-tab.active{background:#c3e92d;border-color:#c3e92d}",
            ".profile-view{display:none}",
            ".profile-view.active{display:block}",
            ".profile-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}",
            ".profile-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}",
            ".team-member-form{display:grid;grid-template-columns:1.2fr 1fr 1fr auto;gap:12px;align-items:end;margin-bottom:22px}",
            ".team-table{width:100%;border-collapse:collapse}",
            ".team-table th,.team-table td{padding:14px 12px;border-bottom:1px solid #eee;text-align:left;vertical-align:middle}",
            ".team-table th{font-family:'Oswald',sans-serif;text-transform:uppercase;font-size:13px;letter-spacing:.06em}",
            ".status-pill{display:inline-block;padding:5px 10px;border-radius:999px;background:#c3e92d;color:#121212;font-size:13px;font-weight:600}",
            ".status-pill.inactive{background:#eeeeee;color:#666}",
            ".mini-btn{border:1px solid #d8d8d8;border-radius:6px;background:#fff;padding:8px 10px;margin-right:6px;color:#121212}",
            ".members-heading{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:24px}",
            ".members-heading h2{margin-bottom:4px}",
            ".members-summary{margin:0;color:#777;font-size:14px}",
            ".member-toolbar{display:grid;grid-template-columns:minmax(220px,1fr) 190px 170px;gap:12px;margin-bottom:18px}",
            ".member-search input,.member-filter select{width:100%;height:48px;border:1px solid #dedede;border-radius:5px;background:#fff;padding:0 14px;color:#222;font-size:15px}",
            ".member-search input:focus,.member-filter select:focus,.member-modal input:focus,.member-modal select:focus{border-color:#94b51c;outline:3px solid rgba(195,233,45,.22)}",
            ".team-table-wrap{overflow:visible;border:1px solid #e9e9e9;border-radius:6px}",
            ".team-table th,.team-table td{padding:15px 14px}",
            ".team-table th{background:#f8f8f6;color:#666}",
            ".team-table tbody tr:last-child td{border-bottom:0}",
            ".team-table tbody tr:hover{background:#fbfcf7}",
            ".team-table th:last-child,.team-table td:last-child{width:52px;text-align:right}",
            ".member-name-button{border:0;padding:0;background:none;color:#171717;font-weight:600;text-align:left}",
            ".member-name-button:hover{color:#708a11;text-decoration:underline}",
            ".member-menu-wrap{position:relative;display:inline-block}",
            ".member-menu-toggle{width:36px;height:36px;border:1px solid transparent;border-radius:5px;background:transparent;color:#333;font-size:22px;line-height:1}",
            ".member-menu-toggle:hover,.member-menu-toggle[aria-expanded=true]{border-color:#e5e5e5;background:#fff}",
            ".member-menu{position:absolute;z-index:5;right:0;top:calc(100% + 4px);min-width:164px;padding:5px;background:#fff;border:1px solid #e5e5e5;border-radius:5px;box-shadow:0 10px 28px rgba(0,0,0,.12)}",
            ".member-menu[hidden],.member-empty[hidden]{display:none}",
            ".member-menu button{display:block;width:100%;padding:9px 10px;border:0;border-radius:3px;background:none;text-align:left;color:#222;font-size:14px}",
            ".member-menu button:hover{background:#f4f5ef}",
            ".member-menu [data-member-action=delete]{color:#b42318}",
            ".member-empty{margin:0;padding:28px 16px;text-align:center;color:#777}",
            ".member-modal .modal-content{padding:28px;border:1px solid #e7e7e7;border-radius:8px}",
            ".member-modal-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:22px}",
            ".member-modal-heading h2{margin:0;font-size:27px;line-height:34px}",
            ".member-eyebrow{margin:0 0 5px;color:#788f1b;font-size:12px;font-weight:700;text-transform:uppercase}",
            ".member-modal-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}",
            ".member-modal .profile-field input,.member-modal .profile-field select{height:48px;border-radius:5px}",
            ".member-modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:24px}",
            ".member-secondary-button,.member-danger-button{min-height:44px;padding:0 16px;border:1px solid #dedede;border-radius:4px;background:#fff;color:#333}",
            ".member-danger-button{border-color:#b42318;background:#b42318;color:#fff}",
            ".member-details-list{margin:0}",
            ".member-details-list div{display:grid;grid-template-columns:110px minmax(0,1fr);gap:12px;padding:13px 0;border-top:1px solid #eee}",
            ".member-details-list dt{color:#777;font-weight:500}",
            ".member-details-list dd{margin:0;color:#222;font-weight:600;overflow-wrap:anywhere}",
            ".member-delete-copy{color:#555;line-height:1.6}",
            ".auth-only-hidden{display:none!important}",
            ".auth-profile-wrap{position:relative;display:inline-flex;align-items:center}",
            ".auth-profile-menu{position:absolute;top:calc(100% + 12px);right:0;width:220px;padding:10px;background:#fff;border:1px solid #e1e1e1;border-radius:8px;box-shadow:0 18px 45px rgba(0,0,0,.14);display:none;z-index:9999}",
            ".auth-profile-menu.open{display:block}",
            ".auth-profile-menu a{display:block;padding:11px 12px;border-radius:6px;color:#121212;font-family:'Oswald',sans-serif;text-transform:uppercase;font-size:14px;line-height:20px}",
            ".auth-profile-menu a:hover{background:#f2f2f2;color:#121212}",
            ".auth-profile-toggle{white-space:nowrap}",
            ".team-chat-header{position:relative;display:flex;align-items:center;margin-left:14px}",
            ".team-chat-nav{position:relative;padding-top:25px!important;padding-bottom:25px!important}",
            ".team-chat-header-toggle{display:grid;width:42px;height:42px;place-items:center;border:1px solid rgba(255,255,255,.28);border-radius:50%;background:rgba(255,255,255,.05);color:#fff;font-size:19px;transition:background .2s ease,border-color .2s ease,transform .2s ease}",
            ".team-chat-header-toggle svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}",
            ".team-chat-header-toggle:hover,.team-chat-header-toggle[aria-expanded=true]{border-color:#c3e92d;background:rgba(195,233,45,.16);transform:translateY(-1px)}",
            ".team-chat-header-panel{position:absolute;z-index:2147483000;top:calc(100% + 14px);right:0;width:min(390px,calc(100vw - 28px));overflow:hidden;border:1px solid #dfe5d8;border-radius:8px;background:#fff;box-shadow:0 22px 55px rgba(0,0,0,.24);color:#20231f}",
            ".team-chat-header-panel:before{position:absolute;top:-7px;right:18px;width:14px;height:14px;background:#fff;border-top:1px solid #dfe5d8;border-left:1px solid #dfe5d8;content:'';transform:rotate(45deg)}",
            ".team-chat-header-panel[hidden]{display:none!important}",
            ".team-chat-header-title{position:relative;display:flex;align-items:center;justify-content:space-between;padding:17px 18px;border-bottom:1px solid #eceee8;background:#f8faf2}",
            ".team-chat-header-title h2{margin:0;color:#20231f;font-family:Oswald,sans-serif;font-size:20px;line-height:1;text-transform:uppercase}",
            ".team-chat-header-title a{color:#506329;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em}",
            ".team-chat-header-list{max-height:min(390px,65vh);overflow:auto}",
            ".team-chat-header-item{display:flex;width:100%;min-height:72px;align-items:center;gap:13px;padding:13px 18px;border:0;border-bottom:1px solid #f0f1ed;background:#fff;text-align:left;transition:background .18s ease}",
            "#mainnav .team-chat-header-item{height:auto;line-height:normal;color:#20231f;font-family:inherit;font-size:14px;letter-spacing:0;text-transform:none}",
            ".team-chat-header-item:hover{background:#f6f9ea}",
            ".team-chat-header-avatar{display:grid;width:42px;height:42px;flex:0 0 42px;place-items:center;overflow:hidden;border-radius:50%;background:#e5edcf;color:#364824;font-family:Oswald,sans-serif;font-size:18px;background-position:center;background-size:cover}",
            ".team-chat-header-avatar.has-image{color:transparent}",
            ".team-chat-header-copy{display:grid;min-width:0;gap:4px}",
            ".team-chat-header-name,.team-chat-header-address{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
            ".team-chat-header-name{color:#20231f;font-size:14px;font-weight:700;letter-spacing:0;text-transform:none}",
            ".team-chat-header-address{color:#62675e;font-size:12px;letter-spacing:0;text-transform:none}",
            ".team-chat-header-empty{margin:0;padding:18px;color:#777b73;font-size:13px}",
            ".team-dashboard-nav>a{white-space:nowrap}",
            ".dashboard-quick-link{display:inline-flex;min-height:40px;align-items:center;justify-content:center;margin-right:12px;padding:0 16px;border-radius:4px;background:#c3e92d;color:#121212!important;font-family:Oswald,sans-serif;font-size:14px;font-weight:700;text-transform:uppercase;white-space:nowrap}",
            ".dashboard-quick-link:hover{background:#d5ff32;color:#121212!important}",
            ".team-notification-nav{position:relative;padding-top:25px!important;padding-bottom:25px!important}",
            ".team-notification-toggle{position:relative;display:grid;width:42px;height:42px;place-items:center;border:1px solid rgba(255,255,255,.28);border-radius:50%;background:rgba(255,255,255,.05);color:#fff;transition:background .2s ease,border-color .2s ease,transform .2s ease}",
            ".team-notification-toggle svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}",
            ".team-notification-toggle:hover,.team-notification-toggle[aria-expanded=true]{border-color:#c3e92d;background:rgba(195,233,45,.16);transform:translateY(-1px)}",
            ".team-notification-badge{position:absolute;top:-5px;right:-5px;display:grid;min-width:18px;height:18px;place-items:center;border-radius:999px;background:#c3e92d;color:#121212;font-size:11px;font-weight:800;line-height:1}",
            ".team-notification-panel{position:absolute;z-index:2147483000;top:calc(100% + 14px);right:0;width:min(390px,calc(100vw - 28px));overflow:hidden;border:1px solid #dfe5d8;border-radius:8px;background:#fff;box-shadow:0 22px 55px rgba(0,0,0,.24);color:#20231f}",
            ".team-notification-panel[hidden]{display:none!important}",
            ".team-notification-title{display:flex;align-items:center;justify-content:space-between;padding:17px 18px;border-bottom:1px solid #eceee8;background:#f8faf2}",
            ".team-notification-title h2{margin:0;color:#20231f;font-family:Oswald,sans-serif;font-size:20px;line-height:1;text-transform:uppercase}",
            ".team-notification-title a,.team-notification-title button{border:0;background:transparent;color:#506329;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em}",
            ".team-notification-list{max-height:min(390px,65vh);overflow:auto}",
            ".team-notification-item{display:grid;width:100%;gap:4px;padding:14px 18px;border:0;border-bottom:1px solid #f0f1ed;background:#fff;text-align:left}",
            ".team-notification-item:hover{background:#f7f9ef}",
            ".team-notification-item.unread{background:#f6f9ea}",
            ".team-notification-item strong{color:#20231f;font-size:14px}",
            ".team-notification-item span{color:#62675e;font-size:12px;line-height:1.45}",
            ".team-notification-empty{margin:0;padding:18px;color:#777b73;font-size:13px}",
            ".team-notification-detail{padding:18px}.team-notification-detail h3{margin:10px 0 8px;color:#20231f;font-family:Oswald,sans-serif;font-size:23px;line-height:1.1;text-transform:uppercase}.team-notification-detail p{margin:0;color:#62675e;font-size:13px;line-height:1.6}.team-notification-detail time{display:block;margin-top:14px;color:#80867a;font-size:11px}.team-notification-back{padding:0;border:0;background:transparent;color:#506329;font-size:12px;font-weight:700;text-transform:uppercase}",
            "@media(max-width:991px){#mainnav-mobi .team-chat-nav{position:static}#mainnav-mobi .team-chat-header-panel{position:fixed;top:72px;right:12px;left:12px;width:auto;max-height:calc(100vh - 88px)}#mainnav-mobi .team-chat-header-list{max-height:calc(100vh - 180px)}}",
            "@media(max-width:991px){#mainnav-mobi .team-notification-nav{position:static}#mainnav-mobi .team-notification-panel{position:fixed;top:72px;right:12px;left:12px;width:auto;max-height:calc(100vh - 88px)}#mainnav-mobi .team-notification-list{max-height:calc(100vh - 180px)}}",
            "#mainnav li.team-profile-nav.open>ul{opacity:1;visibility:visible;transform:translate(0,0)}",
            "#mainnav li.team-profile-nav>ul.team-profile-menu{width:220px;padding:0;border-radius:0;box-shadow:none}",
            "#mainnav ul.menu>li.team-profile-nav.open>a:before,#mainnav ul.menu>li.team-profile-nav>a[aria-expanded=true]:before{transform:scale3d(1,1,1)}",
            "@media(max-width:991px){.profile-layout{grid-template-columns:1fr}.profile-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.auth-grid,.profile-grid,.team-member-form{grid-template-columns:1fr}.auth-modal .modal-content{padding:26px}.member-toolbar{grid-template-columns:minmax(180px,1fr) 1fr 1fr}}",
            "@media(max-width:575px){.auth-modal .modal-dialog{margin:10px}.auth-modal h2,.profile-sidebar h2,.profile-panel h2{font-size:26px;line-height:34px}.profile-tabs{grid-template-columns:1fr}.members-heading{align-items:flex-start;flex-direction:column}.member-toolbar{grid-template-columns:1fr}.team-table-wrap{overflow-x:auto}.team-table{min-width:610px}.member-modal-fields{grid-template-columns:1fr}.member-modal .modal-content{padding:22px}.member-modal-heading h2{font-size:24px;line-height:30px}}"
        ].join("");
        document.head.appendChild(style);
    }

    function authMarkup() {
        return [
            '<div class="modal fade modal-login auth-modal" id="exampleModalToggle" aria-hidden="true" tabindex="-1">',
            '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">',
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>',
            '<h2>Team Login</h2><div class="auth-message" data-auth-message></div>',
            '<form data-auth-login><div class="auth-grid">',
            '<div><label>Email</label><input type="email" name="email" placeholder="Registered email" required></div>',
            '<div><label>Password</label><input type="password" name="password" placeholder="Password" required></div>',
            '</div><div class="auth-help"><a href="#" data-bs-target="#exampleModalToggle3" data-bs-toggle="modal" data-bs-dismiss="modal">Forgot password?</a></div>',
            '<button type="submit" class="flat-button">Login</button></form>',
            '<p class="auth-help">New team? <a href="#" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal" data-bs-dismiss="modal">Register as a team.</a></p>',
            '</div></div></div>',
            '<div class="modal fade modal-login auth-modal" id="exampleModalToggle2" aria-hidden="true" tabindex="-1">',
            '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">',
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>',
            '<h2>Team Signup</h2><div class="auth-message" data-auth-message></div>',
            '<form data-auth-register><div class="auth-grid">',
            '<div><label>Team Name</label><input type="text" name="teamName" placeholder="Team name" required></div>',
            '<div><label>Captain Name</label><input type="text" name="captainName" placeholder="Captain name" required></div>',
            '<div><label>Email</label><input type="email" name="email" placeholder="Registered email" required></div>',
            '<div><label>Phone</label><input type="tel" name="phone" placeholder="Phone number"></div>',
            '<div><label>Sport</label><select name="category"><option>Cricket</option><option>Football</option><option>Multi Sport</option></select></div>',
            '<div><label>Password</label><input type="password" name="password" placeholder="Password" required></div>',
            '<div><label>Confirm Password</label><input type="password" name="confirmPassword" placeholder="Confirm password" required></div>',
            '</div><button type="submit" class="flat-button">Create Team Profile</button></form>',
            '<p class="auth-help">Already registered? <a href="#" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" data-bs-dismiss="modal">Sign in.</a></p>',
            '</div></div></div>',
            '<div class="modal fade modal-login auth-modal" id="exampleModalToggle3" aria-hidden="true" tabindex="-1">',
            '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">',
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>',
            '<h2>Forgot Password</h2><div class="auth-message" data-auth-message></div>',
            '<form data-auth-forgot><div class="profile-field"><label>Registered Email</label><input type="email" name="email" placeholder="Enter registered email" required></div>',
            '<div class="profile-field auth-code-step"><label>Verification Code</label><input type="text" name="code" placeholder="Enter code"></div>',
            '<div class="profile-field auth-code-step"><label>New Password</label><input type="password" name="newPassword" placeholder="New password"></div>',
            '<div class="profile-field auth-code-step"><label>Confirm New Password</label><input type="password" name="confirmPassword" placeholder="Confirm new password"></div>',
            '<button type="submit" class="flat-button">Send Code</button></form>',
            '<p class="auth-help"><a href="#" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" data-bs-dismiss="modal">Back to login</a></p>',
            '</div></div></div>'
        ].join("");
    }

    function ensureAuthModals() {
        qsa("#exampleModalToggle,#exampleModalToggle2,#exampleModalToggle3").forEach(function (modal) {
            modal.remove();
        });

        document.body.insertAdjacentHTML("beforeend", authMarkup());
    }

    function isLoggedIn() {
        return localStorage.getItem(sessionKey) === "active";
    }

    function setLoggedIn() {
        localStorage.setItem(sessionKey, "active");
    }

    function logout() {
        localStorage.removeItem(sessionKey);
        window.location.href = "index.html";
    }

    function enhanceHeaderAuth() {
        ensureHeaderControls();
        qsa(".header-right .login").forEach(function (item) {
            item.remove();
        });

        syncActiveFacility();
        bindHeaderProfileMenu();
        bindHeaderTeamMenu();
        bindHeaderNotifications();
        document.addEventListener("click", function (event) {
            if (!event.target.closest("[data-team-profile-header]")) {
                var profileToggle = qs("[data-team-profile-toggle]");
                var profileItem = qs("[data-team-profile-header]");
                if (profileItem && profileToggle) {
                    profileItem.classList.remove("open");
                    profileToggle.setAttribute("aria-expanded", "false");
                }
            }
            if (!event.target.closest(".team-chat-header, .team-chat-nav")) {
                var panel = qs("[data-team-chat-panel]");
                var toggle = qs("[data-team-chat-toggle]");
                if (panel && toggle) {
                    panel.hidden = true;
                    toggle.setAttribute("aria-expanded", "false");
                }
            }
            if (!event.target.closest(".team-notification-nav")) {
                var notificationPanel = qs("[data-team-notification-panel]");
                var notificationToggle = qs("[data-team-notification-toggle]");
                if (notificationPanel && notificationToggle) {
                    notificationPanel.hidden = true;
                    notificationToggle.setAttribute("aria-expanded", "false");
                }
            }
        });

        syncAuthHeader();
    }

    function ensureHeaderControls() {
        qsa("#mainnav ul.menu > li[data-auth-user]").forEach(function (item) {
            item.remove();
        });
        var menu = qs("#mainnav .menu");
        if (!menu) return;
        var teamsItem = qs('[data-team-directory-link]', menu);
        if (!teamsItem) {
            teamsItem = document.createElement("li");
            teamsItem.setAttribute("data-team-directory-link", "");
            teamsItem.innerHTML = '<a href="community.html">Teams</a>';
            menu.appendChild(teamsItem);
        }

        if (!qs("[data-team-dashboard-link]", menu)) {
            var dashboardItem = document.createElement("li");
            dashboardItem.className = "team-dashboard-nav";
            dashboardItem.setAttribute("data-team-dashboard-link", "");
            dashboardItem.innerHTML = '<a href="dashboard.html">Dashboard</a>';
            teamsItem.insertAdjacentElement("afterend", dashboardItem);
        }

        if (!qs("[data-team-profile-toggle]", menu)) {
            var profileItem = document.createElement("li");
            profileItem.className = "team-profile-nav";
            profileItem.setAttribute("data-team-profile-header", "");
            profileItem.innerHTML = [
                '<a href="#" data-team-profile-toggle aria-expanded="false" aria-controls="teamProfileMenu">Profile</a>',
                '<ul class="submenu team-profile-menu" id="teamProfileMenu" data-team-profile-menu>',
                '<li><a href="#" data-auth-guest data-bs-toggle="modal" data-bs-target="#exampleModalToggle">Login</a></li>',
                '<li><a href="#" data-auth-guest data-bs-toggle="modal" data-bs-target="#exampleModalToggle2">Register Team</a></li>',
                '<li><a href="dashboard.html">My Dashboard</a></li>',
                '<li><a href="profile.html" data-auth-user>My Team Profile</a></li>',
                '<li><a href="#" data-auth-user data-auth-logout>Logout</a></li>',
                '</ul>'
            ].join("");
            menu.appendChild(profileItem);
        }

        if (!qs("[data-team-chat-toggle]", menu)) {
            var chatItem = document.createElement("li");
            chatItem.className = "team-chat-nav";
            chatItem.setAttribute("data-auth-user", "");
            chatItem.innerHTML = [
                '<button type="button" class="team-chat-header-toggle" data-team-chat-toggle aria-label="Open team chats" aria-expanded="false" aria-controls="teamChatHeaderPanel"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z"></path><path d="M8 10h8M8 14h5"></path></svg><span class="visually-hidden">Open team chats</span></button>',
                '<section class="team-chat-header-panel" id="teamChatHeaderPanel" data-team-chat-panel hidden aria-label="Team chats"><div class="team-chat-header-title"><h2>Chats</h2><a href="community.html">All teams</a></div><div class="team-chat-header-list" data-team-chat-list></div></section>'
            ].join("");
            menu.appendChild(chatItem);
        }

        if (!qs("[data-team-notification-toggle]", menu)) {
            var notificationItem = document.createElement("li");
            notificationItem.className = "team-notification-nav";
            notificationItem.innerHTML = [
                '<button type="button" class="team-notification-toggle" data-team-notification-toggle aria-label="Open notifications" aria-expanded="false" aria-controls="teamNotificationPanel">',
                '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"></path><path d="M10 21h4"></path></svg>',
                '<span class="team-notification-badge" data-team-notification-count>0</span><span class="visually-hidden">Open notifications</span></button>',
                '<section class="team-notification-panel" id="teamNotificationPanel" data-team-notification-panel hidden aria-label="Notifications">',
                '<div class="team-notification-title"><h2>Notifications</h2><button type="button" data-notification-read-all>Mark all read</button></div><div class="team-notification-list" data-team-notification-list></div></section>'
            ].join("");
            menu.appendChild(notificationItem);
        }

        var chatToggle = qs("[data-team-chat-toggle]", menu);
        if (chatToggle && !qs("svg", chatToggle)) {
            var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            icon.setAttribute("viewBox", "0 0 24 24");
            icon.setAttribute("aria-hidden", "true");
            icon.innerHTML = '<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z"></path><path d="M8 10h8M8 14h5"></path>';
            var label = qs(".visually-hidden", chatToggle);
            chatToggle.insertBefore(icon, label || null);
        }

        var oldTeamButton = qs(".header-right .btn-contact");
        if (oldTeamButton) oldTeamButton.remove();
        qsa("#mainnav a[href='event-details.html']").forEach(function (link) {
            var item = link.closest("li");
            if (item) item.remove();
        });
    }

    function bindHeaderProfileMenu() {
        var toggle = qs("[data-team-profile-toggle]");
        var menu = qs("[data-team-profile-menu]");
        if (!toggle || !menu) return;
        var parent = toggle.closest("[data-team-profile-header]");
        toggle.addEventListener("click", function (event) {
            event.preventDefault();
            var isOpen = parent && parent.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(!!isOpen));
        });
    }

    function bindHeaderTeamMenu() {
        var toggle = qs("[data-team-chat-toggle]");
        var panel = qs("[data-team-chat-panel]");
        var list = qs("[data-team-chat-list]");
        if (!toggle || !panel || !list) return;

        var teams = window.AlfajjarDemoTeams.slice();
        try {
            var registeredTeams = JSON.parse(localStorage.getItem("alfajjarTeamDirectory") || "[]");
            if (Array.isArray(registeredTeams)) teams = teams.concat(registeredTeams);
        } catch (error) {
            // Keep demo teams available if local directory data is malformed.
        }
        var uniqueTeams = {};
        teams.forEach(function (team) {
            if (team && team.id) uniqueTeams[team.id] = team;
        });
        list.textContent = "";
        Object.keys(uniqueTeams).forEach(function (id) {
            var team = uniqueTeams[id];
            var link = document.createElement("a");
            link.className = "team-chat-header-item";
            link.href = "community.html?team=" + encodeURIComponent(team.id);
            var avatar = document.createElement("span");
            avatar.className = "team-chat-header-avatar";
            avatar.textContent = (team.teamName || "T").charAt(0).toUpperCase();
            if (team.image) {
                avatar.classList.add("has-image");
                avatar.style.backgroundImage = "url('" + team.image + "')";
            }
            var copy = document.createElement("span");
            copy.className = "team-chat-header-copy";
            var name = document.createElement("span");
            name.className = "team-chat-header-name";
            name.textContent = team.teamName || "Unnamed team";
            var address = document.createElement("span");
            address.className = "team-chat-header-address";
            address.textContent = team.address || [team.area, team.city].filter(Boolean).join(", ") || "Address not listed";
            copy.appendChild(name);
            copy.appendChild(address);
            link.appendChild(avatar);
            link.appendChild(copy);
            list.appendChild(link);
        });

        if (!Object.keys(uniqueTeams).length) {
            var empty = document.createElement("p");
            empty.className = "team-chat-header-empty";
            empty.textContent = "No teams are listed yet.";
            list.appendChild(empty);
        }

        toggle.addEventListener("click", function () {
            panel.hidden = !panel.hidden;
            toggle.setAttribute("aria-expanded", String(!panel.hidden));
        });
    }

    function readJson(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
        } catch (error) {
            return fallback;
        }
    }

    function bookingStatus(booking) {
        return booking.status || "Pending";
    }

    function notificationItems() {
        if (!isLoggedIn()) {
            return [{ id: "login-required", time: 0, title: "Login required", text: "Login to see booking, chat, and team notifications." }];
        }
        var profile = getProfile();
        var teamId = profile.directoryId || "team-" + String(profile.email || "local").toLowerCase().replace(/[^a-z0-9]+/g, "-");
        var bookings = readJson("alfajjarBookings", []).filter(function (booking) {
            return String(booking.teamId || "") === String(teamId) || String(booking.opponentTeamId || "") === String(teamId);
        });
        var items = bookings.map(function (booking) {
            var facility = booking.type === "stadium" ? "Stadium match" : "Arena slot";
            return {
                id: "booking-" + (booking.id || [booking.type, booking.date, booking.time, booking.createdAt].join("-")),
                time: Date.parse(booking.createdAt || booking.date || "") || 1,
                title: bookingStatus(booking) + " booking",
                text: facility + " for " + (booking.date || "selected date") + " at " + (booking.time || "the selected time") + " is " + bookingStatus(booking).toLowerCase() + ".",
                detail: "Booking total: PKR " + Number(booking.total || 0).toLocaleString("en-PK") + ". " + (booking.notes || "No booking notes were added.")
            };
        });
        readJson("alfajjarMatchRequests", []).filter(function (request) {
            return String(request.requesterTeamId || "") === String(teamId) || (request.targetTeamIds || []).map(String).indexOf(String(teamId)) !== -1;
        }).forEach(function (request) {
            var sentByUs = String(request.requesterTeamId || "") === String(teamId);
            var response = request.responses && request.responses[teamId];
            items.push({
                id: "request-" + (request.id || Date.parse(request.createdAt || "")),
                time: Date.parse(request.createdAt || "") || 1,
                title: sentByUs ? request.status + " match request" : (response || "New") + " match request",
                text: sentByUs ? "Your Stadium request is for " + (request.date || "the selected date") + "." : (request.requesterTeamName || "A team") + " requested a match on " + (request.date || "the selected date") + ".",
                detail: "Match time: " + (request.time || "Not set") + ". Teams selected: " + (request.targetTeamIds || []).length + ". " + (request.notes || "No additional request notes.")
            });
        });
        var chats = readJson("alfajjarTeamChats", {});
        Object.keys(chats).forEach(function (key) {
            if (key.split("::").indexOf(String(teamId)) === -1) return;
            var messages = Array.isArray(chats[key]) ? chats[key] : [];
            var latest = messages.slice().reverse().find(function (message) { return String(message.senderId || "") !== String(teamId) && !message.deletedForEveryone; });
            if (!latest) return;
            items.push({
                id: "chat-" + (latest.id || latest.sentAt || key),
                time: Date.parse(latest.sentAt || "") || 1,
                title: "New team message",
                text: latest.text || (latest.attachment ? "Sent an attachment." : "You have a new chat update."),
                detail: "Open Team Community from the header chat icon to reply or view the conversation."
            });
        });
        return items.sort(function (left, right) { return right.time - left.time; });
    }

    function bindHeaderNotifications() {
        var toggle = qs("[data-team-notification-toggle]");
        var panel = qs("[data-team-notification-panel]");
        var markRead = qs("[data-notification-read-all]");
        if (!toggle || !panel) return;
        renderHeaderNotifications();
        toggle.addEventListener("click", function () {
            renderHeaderNotifications();
            panel.hidden = !panel.hidden;
            toggle.setAttribute("aria-expanded", String(!panel.hidden));
        });
        if (markRead) {
            markRead.addEventListener("click", function (event) {
                event.preventDefault();
                var readItems = readJson("alfajjarNotificationReads", {});
                notificationItems().forEach(function (item) { readItems[item.id] = Date.now(); });
                localStorage.setItem("alfajjarNotificationReads", JSON.stringify(readItems));
                renderHeaderNotifications();
            });
        }
        list.addEventListener("click", function (event) {
            var back = event.target.closest("[data-notification-back]");
            if (back) {
                renderHeaderNotifications();
                return;
            }
            var item = event.target.closest("[data-notification-id]");
            if (!item) return;
            var readItems = readJson("alfajjarNotificationReads", {});
            readItems[item.getAttribute("data-notification-id")] = Date.now();
            localStorage.setItem("alfajjarNotificationReads", JSON.stringify(readItems));
            renderHeaderNotifications(item.getAttribute("data-notification-id"));
        });
    }

    function renderHeaderNotifications(selectedId) {
        var list = qs("[data-team-notification-list]");
        var count = qs("[data-team-notification-count]");
        if (!list) return;
        var items = notificationItems();
        var readItems = readJson("alfajjarNotificationReads", {});
        var unread = isLoggedIn() ? items.filter(function (item) { return !readItems[item.id]; }).length : items.length;
        list.textContent = "";
        if (count) {
            count.textContent = String(unread);
            count.hidden = !unread;
        }
        var selected = selectedId && items.find(function (item) { return item.id === selectedId; });
        if (selected) {
            var detail = document.createElement("section");
            detail.className = "team-notification-detail";
            detail.innerHTML = "<button type=\"button\" class=\"team-notification-back\" data-notification-back>Back to notifications</button><h3></h3><p></p><time></time>";
            detail.querySelector("h3").textContent = selected.title;
            detail.querySelector("p").textContent = selected.text + " " + (selected.detail || "");
            detail.querySelector("time").textContent = selected.time > 1 ? new Date(selected.time).toLocaleString() : "Current update";
            list.appendChild(detail);
            return;
        }
        if (!items.length) {
            var empty = document.createElement("p");
            empty.className = "team-notification-empty";
            empty.textContent = "No notifications yet.";
            list.appendChild(empty);
            return;
        }
        items.forEach(function (item) {
            var article = document.createElement("button");
            article.type = "button";
            article.className = "team-notification-item";
            article.setAttribute("data-notification-id", item.id);
            if (!readItems[item.id]) article.classList.add("unread");
            var title = document.createElement("strong");
            title.textContent = item.title;
            var text = document.createElement("span");
            text.textContent = item.text;
            article.appendChild(title);
            article.appendChild(text);
            list.appendChild(article);
        });
    }

    function syncAuthHeader() {
        var loggedIn = isLoggedIn();
        var profile = getProfile();
        var profileToggle = qs("[data-team-profile-toggle]");
        if (profileToggle) {
            profileToggle.textContent = loggedIn && profile.teamName ? profile.teamName : "Profile";
        }
        qsa("[data-auth-guest]").forEach(function (item) {
            item.classList.toggle("auth-only-hidden", loggedIn);
        });
        qsa("[data-auth-user]").forEach(function (item) {
            item.classList.toggle("auth-only-hidden", !loggedIn);
        });
        renderHeaderNotifications();
    }

    function syncActiveFacility() {
        var path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
        qsa("#mainnav .submenu li.current-menu-item").forEach(function (item) {
            item.classList.remove("current-menu-item");
        });
        var target = path === "homev2.html" ? 'a[href="homev2.html"]' : 'a[href="index.html"]';
        var activeLink = qs("#mainnav .submenu " + target);
        if (activeLink && activeLink.parentElement) {
            activeLink.parentElement.classList.add("current-menu-item");
        }
    }

    function showMessage(scope, text) {
        var msg = qs("[data-auth-message]", scope);
        if (!msg) return;
        msg.textContent = text;
        msg.classList.add("show");
    }

    function showInlineMessage(selector, text) {
        var msg = qs(selector);
        if (!msg) return;
        msg.textContent = text;
        msg.classList.add("show");
        window.setTimeout(function () {
            msg.classList.remove("show");
        }, 2600);
    }

    function bindAuth() {
        var login = qs("[data-auth-login]");
        var register = qs("[data-auth-register]");
        var forgot = qs("[data-auth-forgot]");

        if (login) {
            login.addEventListener("submit", function (event) {
                event.preventDefault();
                setLoggedIn();
                window.location.href = "profile.html";
            });
        }

        if (register) {
            register.addEventListener("submit", function (event) {
                event.preventDefault();
                var data = new FormData(register);
                if (data.get("password") !== data.get("confirmPassword")) {
                    showMessage(register.closest(".modal-content"), "Password and confirm password must match.");
                    return;
                }

                saveProfile({
                    teamName: data.get("teamName"),
                    captainName: data.get("captainName"),
                    email: data.get("email"),
                    phone: data.get("phone"),
                    category: data.get("category"),
                    address: "",
                    city: "",
                    area: "",
                    notes: "",
                    members: []
                });
                setLoggedIn();
                window.location.href = "profile.html";
            });
        }

        if (forgot) {
            forgot.addEventListener("submit", function (event) {
                event.preventDefault();
                var codeSteps = qsa(".auth-code-step", forgot);
                var button = qs("button", forgot);
                var data = new FormData(forgot);
                if (!codeSteps[0].classList.contains("show")) {
                    codeSteps.forEach(function (step) {
                        step.classList.add("show");
                    });
                    button.textContent = "Reset Password";
                    showMessage(forgot.closest(".modal-content"), "Verification code sent. Demo code: " + fallbackCode + ".");
                    return;
                }

                if (data.get("code") !== fallbackCode) {
                    showMessage(forgot.closest(".modal-content"), "Invalid code. Use demo code " + fallbackCode + ".");
                    return;
                }

                if (!data.get("newPassword") || data.get("newPassword") !== data.get("confirmPassword")) {
                    showMessage(forgot.closest(".modal-content"), "Enter matching new password fields.");
                } else {
                    showMessage(forgot.closest(".modal-content"), "Password reset complete. You can login with your new password.");
                }
            });
        }
    }

    function fillForm(form, profile) {
        Object.keys(profile).forEach(function (key) {
            var field = form.elements[key];
            if (field && field.type !== "file" && typeof profile[key] !== "object") {
                field.value = profile[key] || "";
            }
        });
    }

    function renderMembers(profile) {
        var body = qs("[data-member-list]");
        if (!body) return;
        var search = (qs("[data-member-search]") || {}).value || "";
        var roleFilter = (qs("[data-member-role-filter]") || {}).value || "";
        var statusFilter = (qs("[data-member-status-filter]") || {}).value || "";
        var normalizedSearch = search.trim().toLowerCase();
        var members = (profile.members || []).filter(function (member) {
            var matchesSearch = !normalizedSearch || [member.name, member.phone, member.email, member.jerseyNumber].some(function (value) {
                return String(value || "").toLowerCase().indexOf(normalizedSearch) !== -1;
            });
            return matchesSearch && (!roleFilter || member.role === roleFilter) && (!statusFilter || member.status === statusFilter);
        });

        body.textContent = "";
        members.forEach(function (member) {
            var row = document.createElement("tr");
            var nameCell = document.createElement("td");
            var nameButton = document.createElement("button");
            nameButton.type = "button";
            nameButton.className = "member-name-button";
            nameButton.setAttribute("data-view-member", member.id);
            nameButton.textContent = member.name || "Unnamed member";
            nameCell.appendChild(nameButton);

            var roleCell = document.createElement("td");
            roleCell.textContent = member.role || "-";
            var phoneCell = document.createElement("td");
            phoneCell.textContent = member.phone || member.email || "-";
            if (member.phone && member.email) phoneCell.title = member.email;
            var jerseyCell = document.createElement("td");
            jerseyCell.textContent = member.jerseyNumber || "-";
            var statusCell = document.createElement("td");
            var statusPill = document.createElement("span");
            statusPill.className = "status-pill" + (member.status === "Inactive" ? " inactive" : "");
            statusPill.textContent = member.status || "Active";
            statusCell.appendChild(statusPill);

            var actionCell = document.createElement("td");
            var menuWrap = document.createElement("div");
            menuWrap.className = "member-menu-wrap";
            var menuToggle = document.createElement("button");
            menuToggle.type = "button";
            menuToggle.className = "member-menu-toggle";
            menuToggle.setAttribute("aria-label", "Actions for " + (member.name || "team member"));
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "⋮";
            var menu = document.createElement("div");
            menu.className = "member-menu";
            menu.hidden = true;
            [["edit", "Edit member"], ["toggle", member.status === "Active" ? "Set inactive" : "Set active"], ["delete", "Delete member"]].forEach(function (action) {
                var button = document.createElement("button");
                button.type = "button";
                button.setAttribute("data-member-action", action[0]);
                button.setAttribute("data-member-id", member.id);
                button.textContent = action[1];
                menu.appendChild(button);
            });
            menuWrap.appendChild(menuToggle);
            menuWrap.appendChild(menu);
            actionCell.appendChild(menuWrap);
            row.appendChild(nameCell);
            row.appendChild(roleCell);
            row.appendChild(phoneCell);
            row.appendChild(jerseyCell);
            row.appendChild(statusCell);
            row.appendChild(actionCell);
            body.appendChild(row);
        });

        var emptyState = qs("[data-member-empty]");
        if (emptyState) emptyState.hidden = members.length > 0;
        var count = qs("[data-member-count]");
        if (count) {
            var total = (profile.members || []).length;
            count.textContent = total + (total === 1 ? " member" : " members") + " · " + (profile.members || []).filter(function (member) { return member.status === "Active"; }).length + " active";
        }
    }

    function bindProfile() {
        if (!document.body.classList.contains("team-profile-page")) return;

        var profile = getProfile();
        if (localStorage.getItem(profileKey)) saveProfile(profile);
        var teamForm = qs("[data-team-form]");
        var addressForm = qs("[data-address-form]");
        var preferencesForm = qs("[data-preferences-form]");
        var memberForm = qs("[data-member-form]");
        var memberModalElement = qs("#memberFormModal");
        var detailsModalElement = qs("#memberDetailsModal");
        var deleteModalElement = qs("#deleteMemberModal");
        var memberModal = window.bootstrap && memberModalElement ? window.bootstrap.Modal.getOrCreateInstance(memberModalElement) : null;
        var detailsModal = window.bootstrap && detailsModalElement ? window.bootstrap.Modal.getOrCreateInstance(detailsModalElement) : null;
        var deleteModal = window.bootstrap && deleteModalElement ? window.bootstrap.Modal.getOrCreateInstance(deleteModalElement) : null;
        var pendingDeleteId = null;

        function syncLogoPreview() {
            var preview = qs("[data-team-logo-preview]");
            if (!preview) return;
            preview.textContent = (profile.teamName || "T").charAt(0).toUpperCase();
            if (profile.image) {
                preview.classList.add("has-image");
                preview.style.backgroundImage = "url('" + profile.image + "')";
            } else {
                preview.classList.remove("has-image");
                preview.style.backgroundImage = "";
            }
        }

        if (teamForm) fillForm(teamForm, profile);
        if (addressForm) fillForm(addressForm, profile);
        if (preferencesForm) fillForm(preferencesForm, profile);
        syncLogoPreview();
        renderMembers(profile);

        ["[data-member-search]", "[data-member-role-filter]", "[data-member-status-filter]"].forEach(function (selector) {
            var filter = qs(selector);
            if (filter) filter.addEventListener(selector === "[data-member-search]" ? "input" : "change", function () {
                renderMembers(profile);
            });
        });

        var addMemberButton = qs("[data-add-member]");
        if (addMemberButton && memberForm) {
            addMemberButton.addEventListener("click", function () {
                memberForm.reset();
                memberForm.elements.id.value = "";
                qs("#memberFormTitle").textContent = "Add team member";
                if (memberModal) memberModal.show();
            });
        }

        qsa("[data-profile-tab]").forEach(function (tab) {
            tab.addEventListener("click", function () {
                qsa("[data-profile-tab]").forEach(function (item) { item.classList.remove("active"); });
                qsa("[data-profile-view]").forEach(function (item) { item.classList.remove("active"); });
                tab.classList.add("active");
                qs('[data-profile-view="' + tab.getAttribute("data-profile-tab") + '"]').classList.add("active");
            });
        });

        if (teamForm) {
            var logoInput = qs("[data-team-logo-input]", teamForm);
            if (logoInput) {
                logoInput.addEventListener("change", function () {
                    var file = logoInput.files && logoInput.files[0];
                    if (!file) return;
                    if (!file.type || file.type.indexOf("image/") !== 0) {
                        window.alert("Please choose an image file for the team logo.");
                        logoInput.value = "";
                        return;
                    }
                    var reader = new FileReader();
                    reader.onload = function () {
                        profile.image = String(reader.result || "");
                        saveProfile(profile);
                        syncLogoPreview();
                        syncAuthHeader();
                        showInlineMessage("[data-profile-message]", "Team logo updated.");
                    };
                    reader.readAsDataURL(file);
                });
            }
            teamForm.addEventListener("submit", function (event) {
                event.preventDefault();
                var data = new FormData(teamForm);
                ["teamName", "shortName", "captainName", "viceCaptain", "email", "phone", "whatsapp", "category", "teamLevel", "foundedYear", "homeGround"].forEach(function (key) {
                    profile[key] = data.get(key);
                });
                saveProfile(profile);
                syncLogoPreview();
                syncAuthHeader();
                showInlineMessage("[data-profile-message]", "Team details updated.");
            });
        }

        if (addressForm) {
            addressForm.addEventListener("submit", function (event) {
                event.preventDefault();
                var data = new FormData(addressForm);
                ["address", "city", "area", "district", "postalCode", "notes"].forEach(function (key) {
                    profile[key] = data.get(key);
                });
                saveProfile(profile);
                showInlineMessage("[data-address-message]", "Address details updated.");
            });
        }

        if (preferencesForm) {
            preferencesForm.addEventListener("submit", function (event) {
                event.preventDefault();
                var data = new FormData(preferencesForm);
                ["preferredFacility", "preferredTime", "matchFormat", "jerseyColors", "availableDays", "matchPreferences"].forEach(function (key) {
                    profile[key] = data.get(key);
                });
                saveProfile(profile);
                showInlineMessage("[data-preferences-message]", "Match preferences updated.");
            });
        }

        if (memberForm) {
            memberForm.addEventListener("submit", function (event) {
                event.preventDefault();
                var data = new FormData(memberForm);
                var id = Number(data.get("id")) || Date.now();
                var existing = profile.members.find(function (member) { return member.id === id; });
                var memberData = {
                    id: id,
                    name: data.get("name"),
                    role: data.get("role"),
                    phone: data.get("phone"),
                    email: data.get("email"),
                    jerseyNumber: data.get("jerseyNumber"),
                    status: data.get("status")
                };

                if (existing) {
                    Object.assign(existing, memberData);
                } else {
                    profile.members.push(memberData);
                }

                memberForm.reset();
                memberForm.elements.id.value = "";
                saveProfile(profile);
                renderMembers(profile);
                if (memberModal) memberModal.hide();
                showInlineMessage("[data-profile-message]", "Team member saved.");
            });
        }

        document.addEventListener("click", function (event) {
            var menuToggle = event.target.closest(".member-menu-toggle");
            if (menuToggle) {
                var menu = qs(".member-menu", menuToggle.parentNode);
                var shouldOpen = menu.hidden;
                qsa(".member-menu").forEach(function (item) {
                    item.hidden = true;
                    item.previousElementSibling.setAttribute("aria-expanded", "false");
                });
                menu.hidden = !shouldOpen;
                menuToggle.setAttribute("aria-expanded", String(shouldOpen));
                return;
            }

            qsa(".member-menu").forEach(function (item) {
                if (!item.contains(event.target)) {
                    item.hidden = true;
                    item.previousElementSibling.setAttribute("aria-expanded", "false");
                }
            });

            var memberNameButton = event.target.closest("[data-view-member]");
            if (memberNameButton) {
                var detailMember = profile.members.find(function (item) { return String(item.id) === memberNameButton.getAttribute("data-view-member"); });
                if (detailMember) {
                    qs("[data-detail-name]").textContent = detailMember.name || "Unnamed member";
                    qs("[data-detail-role]").textContent = detailMember.role || "-";
                    qs("[data-detail-phone]").textContent = detailMember.phone || "Not provided";
                    qs("[data-detail-email]").textContent = detailMember.email || "Not provided";
                    qs("[data-detail-jersey]").textContent = detailMember.jerseyNumber || "Not assigned";
                    qs("[data-detail-status]").textContent = detailMember.status || "Active";
                    if (detailsModal) detailsModal.show();
                }
                return;
            }

            var actionButton = event.target.closest("[data-member-action]");
            if (!actionButton) return;
            var actionId = actionButton.getAttribute("data-member-id");
            var selectedMember = profile.members.find(function (item) { return String(item.id) === actionId; });
            if (!selectedMember) return;

            if (actionButton.getAttribute("data-member-action") === "edit" && memberForm) {
                memberForm.reset();
                fillForm(memberForm, selectedMember);
                var roleSelect = memberForm.elements.role;
                if (selectedMember.role && !Array.prototype.some.call(roleSelect.options, function (option) { return option.value === selectedMember.role; })) {
                    roleSelect.add(new Option(selectedMember.role, selectedMember.role, true, true));
                }
                qs("#memberFormTitle").textContent = "Edit team member";
                if (memberModal) memberModal.show();
            }

            if (actionButton.getAttribute("data-member-action") === "toggle") {
                profile.members = profile.members.map(function (member) {
                    if (String(member.id) === actionId) {
                        member.status = member.status === "Active" ? "Inactive" : "Active";
                    }
                    return member;
                });
                saveProfile(profile);
                renderMembers(profile);
            }

            if (actionButton.getAttribute("data-member-action") === "delete") {
                pendingDeleteId = actionId;
                qs("[data-delete-member-name]").textContent = selectedMember.name || "this member";
                if (deleteModal) deleteModal.show();
            }
        });

        var confirmDeleteButton = qs("[data-confirm-delete]");
        if (confirmDeleteButton) {
            confirmDeleteButton.addEventListener("click", function () {
                if (pendingDeleteId === null) return;
                profile.members = profile.members.filter(function (member) { return String(member.id) !== pendingDeleteId; });
                pendingDeleteId = null;
                saveProfile(profile);
                renderMembers(profile);
                if (deleteModal) deleteModal.hide();
            });
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        injectStyles();
        ensureAuthModals();
        enhanceHeaderAuth();
        bindAuth();
        bindProfile();

        document.addEventListener("click", function (event) {
            if (event.target.closest("[data-auth-logout]")) {
                event.preventDefault();
                logout();
            }
        });
    });
}());
