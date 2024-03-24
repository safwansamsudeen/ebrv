// Copyright (c) 2024, Safwan Samsudeen and contributors
// For license information, please see license.txt
function update_total_copies(doc) {
	frappe.model.set_value(
		"Delivery Challan",
		doc.name,
		"total_copies",
		doc.number_of_bundles * doc.copies_per_bundle + doc.loose_copies
	);
}

frappe.ui.form.on("Delivery Challan", {
	number_of_bundles(frm) {
		update_total_copies(frm.doc);
	},
	before_submit(frm) {
		frappe.db.set_value(
			"Annexure Delivery Location",
			frm.doc.delivery_location,
			"workflow_state",
			"DC Raised"
		);
	},
	copies_per_bundle(frm) {
		update_total_copies(frm.doc);
	},
	loose_copies(frm) {
		update_total_copies(frm.doc);
	},
});
