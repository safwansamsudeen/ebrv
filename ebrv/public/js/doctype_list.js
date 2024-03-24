async function assignDespatches(dcs, despatch_id) {
	dcs.map(async ({ name }) => {
		try {
			await frappe.db.set_value("Delivery Challan", name, "despatch", despatch_id);
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

frappe.listview_settings["Delivery Challan"] = {
	refresh: function (listview) {
		if (frappe.desk.despatch_id) {
			listview.page.add_inner_message(
				`Assigning to Despatch <b>${frappe.desk.despatch_id}</b>`
			);
		}
		listview.page.add_action_item("Assign to Despatch", () => {
			const checkedItems = listview.get_checked_items();
			if (!checkedItems.length) {
				frappe.throw("Please select at least one Delivery Challan.");
			}
			if (frappe.desk.despatch_id) {
				frappe.confirm(
					`Are you sure you want to assign these DCs to <b>${frappe.desk.despatch_id}</b>?`
				);
				assignDespatches(checkedItems, frappe.desk.despatch_id);
			} else {
				frappe.prompt(
					{
						label: "Despatch ID",
						fieldname: "despatch_id",
						fieldtype: "Link",
						options: "Despatch",
					},
					({ despatch_id }) => assignDespatches(checkedItems, despatch_id)
				);
			}
		});
	},
};
