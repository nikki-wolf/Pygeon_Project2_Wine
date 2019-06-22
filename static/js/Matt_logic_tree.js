
var Wine = [
  {
    "name": "Wine",
    "parent": "null",
    "status": "red",
    "children": [
      {
        "name": "France",
        "parent": "wine",
        "status": "black",
        "children": [
          {
            "name": "Red Wine-France",
            "status": "red",
            "parent": "France"
          },
          {
            "name": "White Wine-France",
            "status": "red",
            "parent": "France"
          }
        ]
      },
      {
        "name": "Italy",
        "status": "black",
        "parent": "Wine",
        "children": [
          {
            "name": "Red Wine-Italy",
            "status": "red",
            "parent": "Italy",
			      "children": [
			          {
                "name": "Merlot",
                "status": "green",
                "parent": "Red Wine-Italy"
                },
                {
                "name": "Cabernet",
                "status": "green",
                "parent": "Red Wine-Italy"
                }
              ]            
          },
          {
            "name": "White Wine- Italy",
            "status": "red",
            "parent": "Italy",
			"children": [
			  {
				"name": "Blanc",
				"status": "green",
				"parent": "White Wine- Italy"
			  },
			  {
				"name": "Not WHite",
				"status": "green",
				"parent": "White Wine- Italy"
			  }
			]            
          }
        ]
      },
      {
        "name": "Portugal",
        "parent": "Wine",
        "status": "black",
        "children": [
          {
            "name": "Red Wine-Portugal",
            "status": "red",
            "parent": "Portugal"
          },
          {
            "name": "White Wine- Portugal",
            "status": "red",
            "parent": "Portugal"
          }
        ]
      },
    ]
  }
];