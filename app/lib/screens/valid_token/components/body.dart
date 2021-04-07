import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/receive_token/receive_token_screen.dart';
import 'package:healthcare_app/screens/redeem/redeem_screen.dart';
import 'package:healthcare_app/screens/start/start_screen.dart';
import 'package:healthcare_app/utils/index.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Body extends StatelessWidget {
  Future<dynamic> fetchUser() async {
    final response = await HttpClient.get(path: '/healthcare-token/valid');
    return response;
  }

  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  _viewTokenDetail(context, serviceId) async {
    Navigator.push(context, ReceiveTokenScreen.route(serviceId));
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
        child: FutureBuilder<dynamic>(
            future: fetchUser(),
            builder: (BuildContext context, AsyncSnapshot snapshot) {
              if (snapshot.hasData) {
                final tokens = snapshot.data["data"];
                List<Map<String, dynamic>> show = new List();
                for (var token in tokens) {
                  show.add({
                    "id": token['id'],
                    "name": token['name'],
                    "tokenPerPerson": token['tokenPerPerson'].toString(),
                  });
                }
                return Container(
                    alignment: Alignment.topCenter,
                    child: ConstrainedBox(
                        constraints: BoxConstraints(minWidth: 500),
                        child: DataTable(
                          headingRowColor: MaterialStateColor.resolveWith(
                              (states) => Color(0xFF82B1FF)),
                          columns: const <DataColumn>[
                            DataColumn(
                              label: Text(
                                'สิทธิ',
                                style: TextStyle(
                                    fontSize: 20, fontWeight: FontWeight.bold),
                              ),
                            ),
                            DataColumn(
                              label: Text(
                                'จำนวนสิทธิ',
                                style: TextStyle(
                                    fontSize: 20, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                          rows: show.map(
                            (token) {
                              return DataRow(
                                  color:
                                      MaterialStateColor.resolveWith((states) {
                                    return Colors.white;
                                  }),
                                  cells: <DataCell>[
                                    DataCell(
                                        Text(token["name"],
                                            textAlign: TextAlign.center,
                                            style: TextStyle(
                                              fontSize: 16,
                                            )), onTap: () {
                                      _viewTokenDetail(context, token["id"]);
                                    }),
                                    DataCell(
                                        Text(token["tokenPerPerson"],
                                            textAlign: TextAlign.right,
                                            style: TextStyle(
                                              fontSize: 16,
                                            )), onTap: () {
                                      _viewTokenDetail(context, token["id"]);
                                    }),
                                  ]);
                            },
                          ).toList(),
                        )));
              } else {
                return Center(child: CircularProgressIndicator());
              }
            }));
  }
}
