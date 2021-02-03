import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/token/token_screen.dart';
import 'package:pin_entry_text_field/pin_entry_text_field.dart';
import 'package:healthcare_app/utils/index.dart';

class Body extends StatefulWidget {
  final dynamic specialTokenRequest;
  final Function setPolling;

  const Body({Key key, this.specialTokenRequest, this.setPolling})
      : super(key: key);

  @override
  _BodyState createState() => _BodyState();
}

class _BodyState extends State<Body> {
  Future<dynamic> fetchToken() async {
    final serviceId = widget.specialTokenRequest["healthcareToken"]["id"];
    final response =
        await HttpClient.get(path: '/healthcare-token/${serviceId}');
    return response;
  }

  bool _isLoading = false;

  _sendPin(context, String pin) async {
    final numericRegex = RegExp(r'^\d{1,6}$');
    final serviceId = widget.specialTokenRequest["healthcareToken"]["id"];
    if (numericRegex.hasMatch(pin)) {
      setState(() {
        this._isLoading = true;
      });
      print(serviceId);
      final response = await HttpClient.post(
          '/healthcare-token/special-token/receive',
          {"serviceId": serviceId.toString(), "pin": pin.toString()});
      setState(() {
        this._isLoading = false;
      });
      if (response.containsKey("statusCode") && response["statusCode"] != 200) {
        return showDialog(
            context: context,
            builder: (context) {
              return AlertDialog(
                title: Text('Error'),
                content: Text(response["message"]),
              );
            });
      } else {
        widget.setPolling(true);
        Navigator.push(context, TokenScreen.route());
      }
    }
  }

  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
        onWillPop: () async {
          widget.setPolling(true);
          return true;
        },
        child: SingleChildScrollView(
            child: FutureBuilder<dynamic>(
                future: fetchToken(),
                builder: (BuildContext context, AsyncSnapshot snapshot) {
                  if (snapshot.hasData) {
                    final healthcareToken = snapshot.data;
                    return Column(
                      children: [
                        Container(
                            margin: EdgeInsets.all(20),
                            padding: EdgeInsets.all(20),
                            child: Column(
                              children: [
                                Table(
                                  children: [
                                    TableRow(children: [
                                      Text('ชื่อ',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold)),
                                      Text(healthcareToken["name"])
                                    ]),
                                    rowSpacer,
                                    TableRow(children: [
                                      Text('รายละเอียด',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold)),
                                      Text(healthcareToken["description"])
                                    ]),
                                    rowSpacer,
                                    TableRow(children: [
                                      Text('จำนวนสิทธิที่ได้รับ',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold)),
                                      Text(widget.specialTokenRequest['amount']
                                          .toString())
                                    ]),
                                  ],
                                ),
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
                        (() {
                          if (this._isLoading) {
                            return Center(child: CircularProgressIndicator());
                          } else {
                            return Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: PinEntryTextField(
                                fields: 6,
                                isTextObscure: true,
                                showFieldAsBox: true,
                                onSubmit: (pin) {
                                  _sendPin(context, pin);
                                },
                              ),
                            );
                          }
                        }())
                      ],
                    );
                  } else {
                    return Center(child: CircularProgressIndicator());
                  }
                })));
  }
}
