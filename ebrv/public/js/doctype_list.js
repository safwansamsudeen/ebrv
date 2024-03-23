frappe.listview_settings["Delivery Challan"] = {
	refresh: function (listview) {
		// add button in action
		console.log();
		listview.page.add_action_item("Add to Despatch", (selected) => {
			const id = frappe.prompt("Despatch ID?");
			listview.get_checked_items().map(async ({ name }) => {
				await frappe.db.set_value("Delivery Challan", name, "despatch", id);
			});
		});
	},
};
