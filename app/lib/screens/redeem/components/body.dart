import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/authentication.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/utils/index.dart';
import 'package:qr_flutter/qr_flutter.dart';

class Body extends StatelessWidget {
  final dynamic serviceId;
  Body(this.serviceId);

  Future<dynamic> fetchToken() async {
    final response = await HttpClient.get(
        path: '/healthcare-token/balance/${this.serviceId}');
    return response;
  }

  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
      if (state.user != null) {
        return SingleChildScrollView(
            child: FutureBuilder<dynamic>(
                future: fetchToken(),
                builder: (BuildContext context, AsyncSnapshot snapshot) {
                  if (snapshot.hasData) {
                    final token = snapshot.data;
                    if(token["healthcareToken"]["endDate"] == null){
                      token["healthcareToken"]["endDate"] = 'ไม่มีวันหมดอายุ';
                    }
                    return Column(
                      children: [
                        Container(
                            margin: EdgeInsets.all(20),
                            padding: EdgeInsets.all(20),
                            child: Table(
                              children: [
                                TableRow(children: [
                                  Text('ชื่อ',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)),
                                  Text(token["healthcareToken"]["name"])
                                ]),
                                rowSpacer,
                                TableRow(children: [
                                  Text('รายละเอียด',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)),
                                  Text(token["healthcareToken"]["description"])
                                ]),
                                rowSpacer,
                                TableRow(children: [
                                  Text('จำนวน',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)),
                                  Text('${token["balance"]}')
                                ]),
                                rowSpacer,
                                TableRow(children: [
                                  Text('วันหมดสิทธิ์',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold)),
                                  Text(token["healthcareToken"]["endDate"] ==
                                          null
                                      ? '-'
                                      : '${token["healthcareToken"]["endDate"]}')
                                ])
                              ],
                            ),
                            width: double.infinity,
                            decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(10),
                                color: Colors.white,
                                border: Border.all(
                                  color: Colors.grey,
                                  style: BorderStyle.solid,
                                  width: 1,
                                ))),
                        QrImage(
                          data:
                              "{\"userId\":${state.user.id},\"serviceId\":${this.serviceId}}",
                          version: QrVersions.auto,
                          size: 200.0,
                        ),
                      ],
                    );
                  } else {
                    return Center(child: CircularProgressIndicator());
                  }
                }));
      } else {
        return Center(child: CircularProgressIndicator());
      }
    });
  }
}
