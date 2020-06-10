

	let selector = document.getElementById("group-selector");
		selector.addEventListener('click', function(e) {
			let checked = document.querySelector('input[name = "groupSelect"]:checked').value;
			console.log(checked);

		});

			/*if (checked == "newGroup") {
				console.log('starting a new group');

				//clear anything already showing
				let targetDiv = document.getElementById('groupCredentials');
				while(targetDiv.firstChild) {
					targetDiv.removeChild(targetDiv.lastChild);
				}

				// create divs for new input fields
				//create new Group Name div
				let groupName = document.createElement('div');
				groupName.id = "newGroupName";
				groupName.classList.add('form-group');

				// create input fields
				let groupNameLabel = document.createElement('label');
				groupNameLabel.innerHTML = "Group Name";
				groupName.appendChild(groupNameLabel);

				let groupNameText = document.createElement('input');
				groupNameText.setAttribute('type', 'text');
				groupNameText.classList.add('form-control');
				groupName.appendChild(groupNameText);

				let groupNameSpan = document.createElement('span');
				groupNameSpan.classList.add('help-block');
				groupNameSpan.nodeValue = '<?php echo $groupname_err; ?>';
				groupName.appendChild(groupNameSpan);

				// create group pass div
				let groupPass = document.createElement('div');
				groupPass.id = "newGroupPass";

				//create group pass inputs
				let groupPassLabel = document.createElement('label');
				groupPassLabel.innerHTML = "Group Password";
				groupPass.appendChild(groupPassLabel);

				let groupPassInput = document.createElement('input');
				groupPassInput.setAttribute('type', 'text');
				groupPassInput.classList.add('form-control');
				groupPass.appendChild(groupPassInput);

				//create confirm group pass div
				let confirmGroupPass = document.createElement('div');
				confirmGroupPass.id = "confirmNewGroupPass";

				let confirmGroupPassLabel = document.createElement('label');
				confirmGroupPassLabel.innerHTML = "Confirm Group Password";
				confirmGroupPass.appendChild(confirmGroupPassLabel);

				let confirmGroupPassInput = document.createElement('input');
				confirmGroupPassInput.setAttribute('type', 'text');
				confirmGroupPassInput.classList.add('form-control');
				confirmGroupPass.appendChild(confirmGroupPassInput);

				
				//append new input fields to webpage
				targetDiv.appendChild(groupName);
				targetDiv.appendChild(groupPass);
				targetDiv.appendChild(confirmGroupPass);


				//append input fields


			} else if (checked == "joinGroup") {
				console.log('joining an existing group');

				//clear anything already showing
				let targetDiv = document.getElementById('groupCredentials');
				while(targetDiv.firstChild) {
					targetDiv.removeChild(targetDiv.lastChild);
				}

				let groupName = document.createElement('div');
				groupName.id = "joinGroupName";
				groupName.classList.add('form-group');

				// create input fields
				let groupNameLabel = document.createElement('label');
				groupNameLabel.innerHTML = "Group Name";
				groupName.appendChild(groupNameLabel);

				let groupNameText = document.createElement('input');
				groupNameText.setAttribute('type', 'text');
				groupNameText.classList.add('form-control');
				groupName.appendChild(groupNameText);

				let groupNameSpan = document.createElement('span');
				groupNameSpan.classList.add('help-block');
				groupNameSpan.innerHTML = 'Im here';
				groupName.appendChild(groupNameSpan);

				// create group pass div
				let groupPass = document.createElement('div');
				groupPass.id = "newGroupPass";

				//create group pass inputs
				let groupPassLabel = document.createElement('label');
				groupPassLabel.innerHTML = "Group Password";
				groupPass.appendChild(groupPassLabel);

				let groupPassInput = document.createElement('input');
				groupPassInput.setAttribute('type', 'text');
				groupPassInput.classList.add('form-control');
				groupPass.appendChild(groupPassInput);

				targetDiv.appendChild(groupName);
				targetDiv.appendChild(groupPass);
			}

	});
*/
