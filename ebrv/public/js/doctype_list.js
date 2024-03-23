frappe.listview_settings["Delivery Challan"] = {
	refresh: function (listview) {
		// add button in action

		listview.page.add_action_item("Add to Despatch", () => {
			const checkedItems = listview.get_checked_items();
			if (!checkedItems.length) {
				frappe.throw("Please select atleast one Delivery Challan.");
			}
			frappe.prompt(
				{
					label: "Despatch ID",
					fieldname: "despatch_id",
					fieldtype: "Link",
					options: "Despatch",
				},
				({ despatch_id }) => {
					checkedItems.map(async ({ name }) => {
						try {
							await frappe.db.set_value(
								"Delivery Challan",
								name,
								"despatch",
								despatch_id
							);
						} catch (e) {
							console.log(e);
							frappe.throw("There was an error while setting the Despatches.");
						}
					});
					frappe.msgprint(
						`Successfully set <b>${checkedItems.length}</b> DC${
							checkedItems.length !== 1 ? "s" : ""
						} to despatch <b>${despatch_id}</b>`
					);
				}
			);
		});
	},
};
