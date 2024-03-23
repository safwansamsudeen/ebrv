// Copyright (c) 2024, Safwan Samsudeen and contributors
// For license information, please see license.txt

frappe.ui.form.on("Print Order", {
	async before_save(frm) {
		const locs = await frappe.db.get_list("Annexure Delivery Location", {
			filters: { print_order: frm.doc.name },
			fields: ["qty"],
			// Arbitrary limit to ensure bug-less ness
			limit: 100000,
		});
		// frappe.model.set_value('Print Order', frm.doc.name, "remaining")
		frm.doc.unassigned = frm.doc.qty - locs.reduce((a, b) => a + b.qty, 0);
	},
	refresh(frm) {
		if (frm.doc.docstatus === 0) {
			if (!frm.doc.unassigned) {
				frm.dashboard.add_comment(
					`This Order has been broken up correctly - please confirm it using the "Actions" button above.`,
					"green",
					true
				);
			} else {
				frm.dashboard.add_comment(
					`You still have ${frm.doc.unassigned} cop${
						frm.doc.unassigned === 1 ? "y" : "ies"
					} that are unassigned - please assign them to confirm this Order.`,
					"yellow",
					true
				);
			}
		}

		frm.add_custom_button("Annexure", () => {
			frappe.set_route("List", "Annexure Delivery Location", "List", {
				print_order: ["=", frm.doc.name],
			});
		});
		frm.add_custom_button("Add Delivery Location", () => {
			const newDoc = frappe.model.make_new_doc_and_get_name("Annexure Delivery Location");
			frappe.set_route("Form", "Annexure Delivery Location", newDoc);
			frappe.model.set_value(
				"Annexure Delivery Location",
				newDoc,
				"print_order",
				frm.doc.name
			);
		});
	},
});