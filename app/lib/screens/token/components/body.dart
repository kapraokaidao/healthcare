import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/redeem/redeem_screen.dart';
import 'package:healthcare_app/screens/start/start_screen.dart';
import 'package:healthcare_app/utils/index.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Body extends StatelessWidget {
  Future<dynamic> fetchUser() async {
    final response = await HttpClient.get(path: '/healthcare-token/balance');
    //print(response);
    return response;
  }

  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  _viewTokenDetail(context, serviceId) async {
    Navigator.push(context, RedeemScreen.route(serviceId));
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
        child: FutureBuilder<dynamic>(
            future: fetchUser(),
            builder: (BuildContext context, AsyncSnapshot snapshot) {
              if (snapshot.hasData) {
                final users = snapshot.data["data"];
                List<Map<String, dynamic>> show = new List();
                for (var data in users) {
                  show.add({
                    "serviceId": data['healthcareToken']['id'],
                    "name": data['healthcareToken']['name'],
                    "balance": data['balance'].toString(),
                  });
                }
                return Container(
                    alignment: Alignment.topCenter,
                    child: ConstrainedBox(
                        constraints: BoxConstraints(minWidth: 500),
                        child: DataTable(
                          headingRowColor: MaterialStateColor.resolveWith(
                              (states) => Colors.orange),
                          columns: const <DataColumn>[
                            DataColumn(
                              label: Text(
                                'Token name',
                                style: TextStyle(
                                    fontSize: 20,
                                    fontStyle: FontStyle.italic,
                                    fontWeight: FontWeight.bold),
                              ),
                            ),
                            DataColumn(
                              label: Text(
                                'Quality',
                                style: TextStyle(
                                    fontSize: 20,
                                    fontStyle: FontStyle.italic,
                                    fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                          rows: show.map(
                            (user) {
                              return DataRow(cells: <DataCell>[
                                DataCell(
                                    Text(user["name"],
                                        textAlign: TextAlign.center,
                                        style: TextStyle(
                                          fontSize: 16,
                                        )), onTap: () {
                                  _viewTokenDetail(context, user["serviceId"]);
                                }),
                                DataCell(
                                    Text(user["balance"],
                                        textAlign: TextAlign.right,
                                        style: TextStyle(
                                          fontSize: 16,
                                        )), onTap: () {
                                  _viewTokenDetail(context, user["serviceId"]);
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
