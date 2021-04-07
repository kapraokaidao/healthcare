import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/redeem/redeem_screen.dart';
import 'package:healthcare_app/screens/start/start_screen.dart';
import 'package:healthcare_app/utils/index.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Body extends StatelessWidget {
  Future<dynamic> fetchUser() async {
    final response = await HttpClient.getWithoutDecode(path: "/transaction");
    return json.decode(response);
  }

  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
        child: FutureBuilder<dynamic>(
            future: fetchUser(),
            builder: (BuildContext context, AsyncSnapshot snapshot) {
              if (snapshot.hasData) {
                final users = snapshot.data;
                List<Map<String, dynamic>> show = new List();
                for (var data in users) {
                  show.add({
                    "serviceId": data['healthcareToken']['id'],
                    "name": data['healthcareToken']['name'],
                    "hospital": data['destinationUser']['hospital']['fullname'],
                    "amount": data["amount"],
                    "date": DateFormat('dd/MM/yyyy')
                        .format(DateTime.parse(data['createdDate'])),
                  });
                }
                return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 0.0),
                    child: ListView.builder(
                        scrollDirection: Axis.vertical,
                        shrinkWrap: true,
                        physics: BouncingScrollPhysics(),
                        itemCount: show.length,
                        itemBuilder: (BuildContext context, int index) {
                          return Card(
                              child: ExpansionTile(
                            title: Column(
                              children: <Widget>[
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: <Widget>[
                                    Text(show[index]["date"],
                                        style: TextStyle(fontSize: 16.0)),
                                    Text(show[index]["name"],
                                        style: TextStyle(fontSize: 16.0)),
                                  ],
                                )
                              ],
                            ),
                            children: <Widget>[
                              Divider(),
                              ListTile(
                                dense: true,
                                leading: Text("โรงพยาบาล: ",
                                    style: TextStyle(fontSize: 14.0)),
                                trailing: Text(show[index]["hospital"],
                                    style: TextStyle(fontSize: 14.0)),
                              ),
                              ListTile(
                                dense: true,
                                leading: Text("จำนวน: ",
                                    style: TextStyle(fontSize: 14.0)),
                                trailing: Text(show[index]["amount"].toString(),
                                    style: TextStyle(fontSize: 14.0)),
                              )
                            ],
                          ));
                        }));
              } else {
                return Center(child: CircularProgressIndicator());
              }
            }));
  }
}
