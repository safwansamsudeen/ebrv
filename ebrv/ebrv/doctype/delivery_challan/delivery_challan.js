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

function uuidv4() {
	return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
		(+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
	);
}

frappe.ui.form.on("Delivery Challan", {
	print_order(frm) {
		frm.set_query("delivery_location", function () {
			return {
				filters: [["print_order", "=", frm.doc.print_order]],
			};
		});
	},
	before_save: (frm) => {
		if (frm.doc.workflow_state1 === "Despatched") {
			console.log("in");
			frappe.model.set_value("Delivery Challan", frm.doc.name, "ebrv_id", uuidv4());
		}
	},
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
