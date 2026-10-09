(function () {
    "use strict";

    var directoryKey = "alfajjarTeamDirectory";
    var conversationKey = "alfajjarTeamChats";
    var profileKey = "alfajjarTeamProfile";
    var demoTeams = window.AlfajjarDemoTeams || [];
    var currentTeam = getCurrentTeam();
    var activePeerId = null;
    var pendingDeleteMessageId = null;
    var detailsModal;
    var deleteModal;

    function qs(selector, scope) {
        return (scope || document).querySelector(selector);
    }

    function qsa(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    function getCurrentTeam() {
        try {
            var profile = JSON.parse(localStorage.getItem(profileKey) || "null");
            if (profile && profile.teamName) {
                return {
                    id: profile.directoryId || "team-" + String(profile.email || "local").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    teamName: profile.teamName,
                    captainName: profile.captainName || "",
                    category: profile.category || "Other",
                    city: profile.city || "",
                    memberCount: (profile.members || []).length,
                    image: profile.image || ""
                };
            }
        } catch (error) {
            return { id: "local-preview-team", teamName: "Your team", category: "Multi Sport", city: "" };
        }
        return { id: "local-preview-team", teamName: "Your team", category: "Multi Sport", city: "" };
    }

    function readArray(key) {
        try {
            var value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch (error) {
            return [];
        }
    }

    function readChats() {
        try {
            var chats = JSON.parse(localStorage.getItem(conversationKey) || "{}");
            return chats && typeof chats === "object" && !Array.isArray(chats) ? chats : {};
        } catch (error) {
            return {};
        }
    }

    function saveChats(chats) {
        try {
            localStorage.setItem(conversationKey, JSON.stringify(chats));
            return true;
        } catch (error) {
            window.alert("This browser has run out of local storage. Remove a large attachment and try again.");
            return false;
        }
    }

    function getTeams() {
        var teams = demoTeams.concat(readArray(directoryKey));
        var byId = {};
        teams.forEach(function (team) {
            if (team && team.id) byId[team.id] = Object.assign({}, byId[team.id] || {}, team);
        });
        return Object.keys(byId).map(function (id) { return byId[id]; });
    }

    function findTeam(id) {
        if (id === currentTeam.id) return currentTeam;
        return getTeams().find(function (team) { return String(team.id) === String(id); }) || {
            id: id,
            teamName: "Team",
            category: "Sports team",
            city: ""
        };
    }

    function escapeClass(value) {
        return String(value || "team").toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    }

    function makeElement(tag, className, text) {
        var element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

    function renderDirectory() {
        var grid = qs("[data-team-directory]");
        if (!grid) return;
        var search = (qs("[data-team-search]").value || "").trim().toLowerCase();
        var sport = qs("[data-sport-filter]").value;
        var teams = getTeams().filter(function (team) {
            var searchable = [team.teamName, team.captainName, team.category, team.city, team.area].join(" ").toLowerCase();
            return (!search || searchable.indexOf(search) !== -1) && (!sport || team.category === sport);
        });

        grid.textContent = "";
        teams.forEach(function (team, index) {
            var card = makeElement("article", "team-card");
            card.style.setProperty("--team-image", "url('" + (team.image || demoTeams[index % demoTeams.length].image) + "')");
            var image = makeElement("div", "team-card-image team-image-" + escapeClass(team.category));
            image.setAttribute("aria-hidden", "true");
            var content = makeElement("div", "team-card-content");
            var sportLabel = makeElement("p", "team-card-sport", team.category || "Other");
            var title = makeElement("h3", "team-card-title", team.teamName || "Unnamed team");
            var location = makeElement("p", "team-card-location", [team.city, team.area].filter(Boolean).join(" · ") || "Location not provided");
            var captain = makeElement("p", "team-card-captain", "Captain  " + (team.captainName || "Not listed"));
            var footer = makeElement("div", "team-card-footer");
            var rosterCount = Number(team.memberCount) || 0;
            footer.appendChild(makeElement("span", "team-card-count", rosterCount + (rosterCount === 1 ? " player" : " players")));
            var detailsButton = makeElement("button", "team-card-link", "View team");
            detailsButton.type = "button";
            detailsButton.setAttribute("data-open-details", team.id);
            footer.appendChild(detailsButton);
            var messageButton = makeElement("button", "community-primary-button team-card-message", "Message");
            messageButton.type = "button";
            messageButton.setAttribute("data-start-chat", team.id);
            if (String(team.id) === String(currentTeam.id)) {
                messageButton.disabled = true;
                messageButton.textContent = "Your team";
            }
            content.appendChild(sportLabel);
            content.appendChild(title);
            content.appendChild(location);
            content.appendChild(captain);
            content.appendChild(footer);
            card.appendChild(image);
            card.appendChild(content);
            card.appendChild(messageButton);
            grid.appendChild(card);
        });

        qs("[data-directory-empty]").hidden = teams.length > 0;
        qs("[data-team-result-count]").textContent = teams.length + (teams.length === 1 ? " team" : " teams");
    }

    function showTeamDetails(teamId) {
        var team = findTeam(teamId);
        qs("[data-details-cover]").style.setProperty("--team-image", "url('" + (team.image || demoTeams[0].image) + "')");
        qs("[data-details-sport]").textContent = team.category || "Other";
        qs("[data-details-name]").textContent = team.teamName || "Unnamed team";
        qs("[data-details-location]").textContent = [team.city, team.area, team.address].filter(Boolean).join(" · ") || "Location not provided";
        qs("[data-details-captain]").textContent = team.captainName || "Not listed";
        qs("[data-details-members]").textContent = String(Number(team.memberCount) || 0);
        qs("[data-details-notes]").textContent = team.notes || "This team has not added a description yet.";
        var messageButton = qs("[data-details-message]");
        messageButton.dataset.teamId = String(team.id);
        messageButton.disabled = String(team.id) === String(currentTeam.id);
        if (detailsModal) detailsModal.show();
    }

    function getThreadKey(peerId) {
        return [String(currentTeam.id), String(peerId)].sort().join("::");
    }

    function renderConversations() {
        var list = qs("[data-conversation-list]");
        if (!list) return;
        var chats = readChats();
        var search = (qs("[data-chat-search]").value || "").trim().toLowerCase();
        var peers = Object.keys(chats).map(function (key) {
            var peerId = key.split("::").filter(function (id) { return id !== String(currentTeam.id); })[0];
            return peerId ? { id: peerId, messages: chats[key] || [], team: findTeam(peerId) } : null;
        }).filter(Boolean).filter(function (conversation) {
            return (conversation.team.teamName || "").toLowerCase().indexOf(search) !== -1;
        }).sort(function (left, right) {
            var leftMessage = left.messages[left.messages.length - 1];
            var rightMessage = right.messages[right.messages.length - 1];
            return new Date(rightMessage && rightMessage.sentAt || 0) - new Date(leftMessage && leftMessage.sentAt || 0);
        });

        list.textContent = "";
        peers.forEach(function (conversation) {
            var button = makeElement("button", "conversation-item" + (String(activePeerId) === String(conversation.id) ? " active" : ""));
            button.type = "button";
            button.setAttribute("data-select-chat", conversation.id);
            var avatar = makeElement("span", "conversation-avatar", (conversation.team.teamName || "T").charAt(0).toUpperCase());
            if (conversation.team.image) {
                avatar.classList.add("has-image");
                avatar.style.backgroundImage = "url('" + conversation.team.image + "')";
            }
            var info = makeElement("span", "conversation-item-info");
            var name = makeElement("span", "conversation-item-name", conversation.team.teamName || "Team");
            var latest = conversation.messages.slice().reverse().find(function (message) {
                return !(message.hiddenFor || []).includes(currentTeam.id);
            });
            var previewText = latest ? (latest.deletedForEveryone ? "Message deleted" : latest.attachment ? "Attachment: " + latest.attachment.name : latest.text || "New message") : "Start a conversation";
            info.appendChild(name);
            info.appendChild(makeElement("span", "conversation-item-preview", previewText));
            button.appendChild(avatar);
            button.appendChild(info);
            list.appendChild(button);
        });
        qs("[data-conversation-empty]").hidden = peers.length > 0;
        qs("[data-chat-count]").textContent = String(peers.length);
    }

    function formatTime(isoDate) {
        var date = new Date(isoDate);
        if (isNaN(date.getTime())) return "";
        return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }

    function buildMessage(message) {
        var mine = String(message.senderId) === String(currentTeam.id);
        var wrapper = makeElement("article", "message-row" + (mine ? " mine" : " theirs"));
        wrapper.dataset.messageId = String(message.id);
        var bubble = makeElement("div", "message-bubble");
        if (message.deletedForEveryone) {
            bubble.appendChild(makeElement("p", "message-deleted", "This message was deleted."));
        } else {
            if (message.text) bubble.appendChild(makeElement("p", "message-text", message.text));
            if (message.attachment) {
                var attachment = document.createElement("a");
                attachment.className = "message-attachment";
                attachment.href = message.attachment.dataUrl;
                attachment.download = message.attachment.name;
                attachment.textContent = "Download " + message.attachment.name;
                attachment.setAttribute("rel", "noopener");
                bubble.appendChild(attachment);
            }
            if (message.edited) bubble.appendChild(makeElement("span", "message-edited", "edited"));
        }
        var metadata = makeElement("div", "message-meta", formatTime(message.sentAt));
        if (!message.deletedForEveryone) {
            var actions = makeElement("div", "message-actions");
            if (mine) {
                var editButton = makeElement("button", "message-action", "Edit");
                editButton.type = "button";
                editButton.setAttribute("data-edit-message", message.id);
                actions.appendChild(editButton);
            }
            var deleteButton = makeElement("button", "message-action message-action-delete", "Delete");
            deleteButton.type = "button";
            deleteButton.setAttribute("data-delete-message", message.id);
            actions.appendChild(deleteButton);
            metadata.appendChild(actions);
        }
        bubble.appendChild(metadata);
        wrapper.appendChild(bubble);
        return wrapper;
    }

    function renderMessages() {
        var chatWindow = qs("[data-chat-conversation]");
        var emptyState = qs("[data-chat-empty-state]");
        if (!activePeerId) {
            chatWindow.hidden = true;
            emptyState.hidden = false;
            return;
        }
        var peer = findTeam(activePeerId);
        var chats = readChats();
        var key = getThreadKey(activePeerId);
        var messages = chats[key] || [];
        chatWindow.hidden = false;
        emptyState.hidden = true;
        var chatAvatar = qs("[data-chat-avatar]");
        chatAvatar.textContent = (peer.teamName || "T").charAt(0).toUpperCase();
        if (peer.image) {
            chatAvatar.classList.add("has-image");
            chatAvatar.style.backgroundImage = "url('" + peer.image + "')";
        } else {
            chatAvatar.classList.remove("has-image");
            chatAvatar.style.backgroundImage = "";
        }
        qs("[data-chat-team-name]").textContent = peer.teamName || "Team";
        qs("[data-chat-team-meta]").textContent = [peer.category, peer.city].filter(Boolean).join(" · ") || "Sports team";
        var list = qs("[data-message-list]");
        list.textContent = "";
        messages.filter(function (message) {
            return !(message.hiddenFor || []).includes(currentTeam.id);
        }).forEach(function (message) {
            list.appendChild(buildMessage(message));
        });
        if (!list.childElementCount) {
            var start = makeElement("div", "chat-start-note");
            start.appendChild(makeElement("span", "chat-start-date", "Conversation started"));
            start.appendChild(makeElement("p", "", "Send a message to " + (peer.teamName || "this team") + " to get the conversation started."));
            list.appendChild(start);
        }
        list.scrollTop = list.scrollHeight;
        renderConversations();
    }

    function openChat(peerId) {
        if (String(peerId) === String(currentTeam.id)) return;
        activePeerId = String(peerId);
        var chats = readChats();
        var key = getThreadKey(activePeerId);
        if (!Array.isArray(chats[key])) chats[key] = [];
        saveChats(chats);
        showView("chats");
        renderMessages();
        if (window.matchMedia("(max-width: 760px)").matches) {
            qs(".chat-workspace").classList.add("conversation-open");
        }
    }

    function showView(viewName) {
        qsa("[data-community-tab]").forEach(function (tab) {
            var selected = tab.getAttribute("data-community-tab") === viewName;
            tab.classList.toggle("active", selected);
            tab.setAttribute("aria-selected", String(selected));
        });
        qsa("[data-community-view]").forEach(function (view) {
            var selected = view.getAttribute("data-community-view") === viewName;
            view.classList.toggle("active", selected);
            view.hidden = !selected;
        });
        if (viewName === "chats") renderConversations();
    }

    function editMessage(messageId) {
        var chats = readChats();
        var key = getThreadKey(activePeerId);
        var message = (chats[key] || []).find(function (item) { return String(item.id) === String(messageId); });
        if (!message || message.deletedForEveryone || String(message.senderId) !== String(currentTeam.id)) return;
        var row = qs('[data-message-id="' + CSS.escape(String(messageId)) + '"]');
        if (!row) return;
        var bubble = qs(".message-bubble", row);
        bubble.textContent = "";
        var form = makeElement("form", "message-edit-form");
        var input = document.createElement("input");
        input.type = "text";
        input.value = message.text || "";
        input.setAttribute("aria-label", "Edit message");
        input.required = !message.attachment;
        var actions = makeElement("div", "message-edit-actions");
        var save = makeElement("button", "message-action", "Save");
        save.type = "submit";
        var cancel = makeElement("button", "message-action", "Cancel");
        cancel.type = "button";
        actions.appendChild(save);
        actions.appendChild(cancel);
        form.appendChild(input);
        form.appendChild(actions);
        bubble.appendChild(form);
        input.focus();
        input.select();
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            message.text = input.value.trim();
            message.edited = true;
            if (saveChats(chats)) renderMessages();
        });
        cancel.addEventListener("click", renderMessages);
    }

    function init() {
        if (!document.body.classList.contains("community-page")) return;
        detailsModal = window.bootstrap && qs("#teamDetailsModal") ? window.bootstrap.Modal.getOrCreateInstance(qs("#teamDetailsModal")) : null;
        deleteModal = window.bootstrap && qs("#messageDeleteModal") ? window.bootstrap.Modal.getOrCreateInstance(qs("#messageDeleteModal")) : null;
        renderDirectory();
        renderConversations();

        qsa("[data-community-tab]").forEach(function (tab) {
            tab.addEventListener("click", function () { showView(tab.getAttribute("data-community-tab")); });
        });
        qs("[data-team-search]").addEventListener("input", renderDirectory);
        qs("[data-sport-filter]").addEventListener("change", renderDirectory);
        qs("[data-chat-search]").addEventListener("input", renderConversations);
        qs("[data-open-directory]").addEventListener("click", function () { showView("directory"); });

        document.addEventListener("click", function (event) {
            var details = event.target.closest("[data-open-details]");
            var startChat = event.target.closest("[data-start-chat]");
            var selectChat = event.target.closest("[data-select-chat]");
            var edit = event.target.closest("[data-edit-message]");
            var remove = event.target.closest("[data-delete-message]");
            if (details) showTeamDetails(details.getAttribute("data-open-details"));
            if (startChat) openChat(startChat.getAttribute("data-start-chat"));
            if (selectChat) {
                openChat(selectChat.getAttribute("data-select-chat"));
                qs(".chat-workspace").classList.remove("conversation-open");
            }
            if (edit) editMessage(edit.getAttribute("data-edit-message"));
            if (remove) {
                pendingDeleteMessageId = remove.getAttribute("data-delete-message");
                var deleteMessage = (readChats()[getThreadKey(activePeerId)] || []).find(function (item) {
                    return String(item.id) === pendingDeleteMessageId;
                });
                qs('[data-confirm-delete-message="everyone"]').hidden = !deleteMessage || String(deleteMessage.senderId) !== String(currentTeam.id);
                qs("[data-message-delete-copy]").textContent = "Choose who this message should be deleted for.";
                if (deleteModal) deleteModal.show();
            }
        });

        qs("[data-details-message]").addEventListener("click", function () {
            var peerId = this.dataset.teamId;
            if (detailsModal) detailsModal.hide();
            openChat(peerId);
        });
        qs("[data-chat-team-details]").addEventListener("click", function () { showTeamDetails(activePeerId); });
        qs("[data-chat-back]").addEventListener("click", function () {
            qs(".chat-workspace").classList.remove("conversation-open");
            activePeerId = null;
            renderMessages();
        });

        qs("[data-message-form]").addEventListener("submit", function (event) {
            event.preventDefault();
            if (!activePeerId) return;
            var input = qs("[data-message-input]");
            var fileInput = qs("[data-message-file]");
            var text = input.value.trim();
            var file = fileInput.files && fileInput.files[0];
            if (!text && !file) return;
            if (file && file.size > 512000) {
                window.alert("Choose a file smaller than 500 KB for this browser-only demo.");
                return;
            }
            function saveMessage(attachment) {
                var chats = readChats();
                var key = getThreadKey(activePeerId);
                chats[key] = chats[key] || [];
                chats[key].push({
                    id: "message-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
                    senderId: currentTeam.id,
                    text: text,
                    attachment: attachment,
                    sentAt: new Date().toISOString(),
                    hiddenFor: []
                });
                if (saveChats(chats)) {
                    input.value = "";
                    fileInput.value = "";
                    renderMessages();
                }
            }
            if (file) {
                var reader = new FileReader();
                reader.onload = function () {
                    saveMessage({ name: file.name, type: file.type || "application/octet-stream", dataUrl: reader.result });
                };
                reader.onerror = function () { window.alert("That file could not be attached. Please try again."); };
                reader.readAsDataURL(file);
            } else {
                saveMessage(null);
            }
        });

        qsa("[data-confirm-delete-message]").forEach(function (button) {
            button.addEventListener("click", function () {
                if (!pendingDeleteMessageId || !activePeerId) return;
                var chats = readChats();
                var key = getThreadKey(activePeerId);
                var message = (chats[key] || []).find(function (item) { return String(item.id) === pendingDeleteMessageId; });
                if (message) {
                    if (button.getAttribute("data-confirm-delete-message") === "everyone") {
                        message.text = "";
                        message.attachment = null;
                        message.deletedForEveryone = true;
                    } else {
                        message.hiddenFor = message.hiddenFor || [];
                        if (!message.hiddenFor.includes(currentTeam.id)) message.hiddenFor.push(currentTeam.id);
                    }
                    saveChats(chats);
                }
                pendingDeleteMessageId = null;
                if (deleteModal) deleteModal.hide();
                renderMessages();
            });
        });

        window.addEventListener("storage", function (event) {
            if (event.key === directoryKey) renderDirectory();
            if (event.key === conversationKey) {
                renderConversations();
                renderMessages();
            }
        });

        var selectedTeamId = new URLSearchParams(window.location.search).get("team");
        if (selectedTeamId && findTeam(selectedTeamId)) showTeamDetails(selectedTeamId);
    }

    document.addEventListener("DOMContentLoaded", init);
}());
