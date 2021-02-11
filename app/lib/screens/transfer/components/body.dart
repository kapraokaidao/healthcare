import 'package:flutter/material.dart';
import 'package:healthcare_app/screens/token/token_screen.dart';
import 'package:pin_entry_text_field/pin_entry_text_field.dart';
import 'package:healthcare_app/utils/index.dart';

class Body extends StatefulWidget {
  final dynamic redeemRequest;
  final Function setPolling;

  const Body({Key key, this.redeemRequest, this.setPolling}) : super(key: key);

  @override
  _BodyState createState() => _BodyState();
}

class _BodyState extends State<Body> {
  Future<dynamic> fetchToken() async {
    final serviceId = widget.redeemRequest["healthcareToken"]["id"];
    final response =
        await HttpClient.get(path: '/healthcare-token/balance/${serviceId}');
    return response;
  }

  bool _isLoading = false;

  _sendPin(context, String pin) async {
    final numericRegex = RegExp(r'^\d{1,6}$');
    final serviceId = widget.redeemRequest["healthcareToken"]["id"];
    if (numericRegex.hasMatch(pin)) {
      setState(() {
        this._isLoading = true;
      });
      try {
        final response = await HttpClient.post('/healthcare-token/redeem',
            {"serviceId": serviceId.toString(), "pin": pin.toString()});
        widget.setPolling(true);
        Navigator.push(context, TokenScreen.route());
        setState(() {
          this._isLoading = false;
        });
      } catch (e) {
        setState(() {
          this._isLoading = false;
        });
        return showDialog(
            context: context,
            builder: (context) {
              return AlertDialog(
                title: Text('Error'),
                content: Text(e.toString()),
              );
            });
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
                    final balance = snapshot.data;
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
                                      Text(balance["healthcareToken"]["name"])
                                    ]),
                                    rowSpacer,
                                    TableRow(children: [
                                      Text('รายละเอียด',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold)),
                                      Text(balance["healthcareToken"]
                                          ["description"])
                                    ]),
                                    rowSpacer,
                                    TableRow(children: [
                                      Text('จำนวนสิทธิที่มี',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold)),
                                      Text(balance["balance"].toString())
                                    ]),
                                    rowSpacer,
                                    TableRow(children: [
                                      Text('จำนวนสิทธิที่ใช้',
                                          style: TextStyle(
                                              fontWeight: FontWeight.bold)),
                                      Text(widget.redeemRequest['amount']
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
